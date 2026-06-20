import json
import os
import time
import uuid
import boto3
import urllib3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
http = urllib3.PoolManager()

JWT_SECRET = os.environ['JWT_SECRET']
GROQ_API_KEY = os.environ['GROQ_API_KEY']
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

topics_table = dynamodb.Table(os.environ.get('TOPICS_TABLE', 'Topics'))
quizzes_table = dynamodb.Table(os.environ.get('QUIZZES_TABLE', 'Quizzes'))
results_table = dynamodb.Table(os.environ.get('RESULTS_TABLE', 'Results'))

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
}


def lambda_handler(event, context):
    try:
        method = event.get('httpMethod', '')
        resource = event.get('resource', '')
        path_params = event.get('pathParameters') or {}
        body = json.loads(event.get('body') or '{}')

        if resource == '/quizzes/generate' and method == 'POST':
            return generate_quiz(body)
        elif resource == '/quizzes/{quizId}' and method == 'GET':
            return get_quiz(path_params.get('quizId'))
        elif resource == '/quizzes/{quizId}/submit' and method == 'POST':
            return submit_quiz(path_params.get('quizId'), body)
        else:
            return response(404, {"error": "Ruta no encontrada"})

    except Exception as e:
        print(f"Error: {str(e)}")
        return response(500, {"error": str(e)})


def generate_quiz(body):
    document_id = body.get('documentId')
    num_questions = body.get('numQuestions', 5)
    difficulty = body.get('difficulty', 'intermedio')

    if not document_id:
        return response(400, {"error": "documentId es requerido"})

    topics_result = topics_table.query(
        KeyConditionExpression=Key('documentId').eq(document_id)
    )
    topics = topics_result.get('Items', [])

    if not topics:
        return response(404, {"error": "No se encontraron temas para este documento"})

    topic_names = [t.get('name', '') for t in topics]

    questions = call_groq_for_questions(topic_names, num_questions, difficulty)

    quiz_id = str(uuid.uuid4())
    quizzes_table.put_item(Item={
        'quizId': quiz_id,
        'documentId': document_id,
        'difficulty': difficulty,
        'questions': questions,
        'createdAt': int(time.time())
    })

    # Devolvemos las preguntas SIN la respuesta correcta ni explicación
    public_questions = [
        {
            "questionId": q["questionId"],
            "question": q["question"],
            "options": q["options"]
        }
        for q in questions
    ]

    return response(201, {"quizId": quiz_id, "questions": public_questions})


def get_quiz(quiz_id):
    if not quiz_id:
        return response(400, {"error": "quizId es requerido"})

    result = quizzes_table.get_item(Key={'quizId': quiz_id})
    quiz = result.get('Item')

    if not quiz:
        return response(404, {"error": "Quiz no encontrado"})

    public_questions = [
        {
            "questionId": q["questionId"],
            "question": q["question"],
            "options": q["options"]
        }
        for q in quiz['questions']
    ]

    return response(200, {"quizId": quiz_id, "questions": public_questions})


def submit_quiz(quiz_id, body):
    user_id = body.get('userId')
    answers = body.get('answers', {})  # { "questionId": "opcionElegida" }

    if not quiz_id or not user_id:
        return response(400, {"error": "quizId y userId son requeridos"})

    result = quizzes_table.get_item(Key={'quizId': quiz_id})
    quiz = result.get('Item')

    if not quiz:
        return response(404, {"error": "Quiz no encontrado"})

    correct_count = 0
    detail = []

    for q in quiz['questions']:
        qid = q['questionId']
        user_answer = answers.get(qid)
        is_correct = user_answer == q['correctAnswer']
        if is_correct:
            correct_count += 1
        detail.append({
            "questionId": qid,
            "yourAnswer": user_answer,
            "correctAnswer": q['correctAnswer'],
            "isCorrect": is_correct,
            "explanation": q.get('explanation', '')
        })

    total = len(quiz['questions'])

    # IMPORTANTE: DynamoDB no acepta floats nativos de Python (lanza
    # "Float types are not supported"). Por eso se convierte a Decimal
    # antes de guardar, y de vuelta a float solo para la respuesta JSON.
    score = Decimal(str(round((correct_count / total) * 100, 1))) if total > 0 else Decimal(0)

    results_table.put_item(Item={
        'userId': user_id,
        'quizId': quiz_id,
        'documentId': quiz.get('documentId'),
        'score': score,
        'correctCount': correct_count,
        'totalQuestions': total,
        'completedAt': int(time.time())
    })

    return response(200, {
        "score": float(score),
        "correctCount": correct_count,
        "totalQuestions": total,
        "detail": detail
    })


def call_groq_for_questions(topic_names, num_questions, difficulty):
    topics_str = ", ".join(topic_names)

    prompt = f"""Genera {num_questions} preguntas de opción múltiple de nivel {difficulty} sobre estos temas: {topics_str}.

Responde SOLO con un JSON válido, sin texto adicional, con este formato exacto:
{{
  "questions": [
    {{
      "question": "texto de la pregunta",
      "options": {{"A": "opción A", "B": "opción B", "C": "opción C", "D": "opción D"}},
      "correctAnswer": "A",
      "explanation": "por qué esta es la respuesta correcta"
    }}
  ]
}}
"""

    payload = json.dumps({
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5,
        "response_format": {"type": "json_object"}
    })

    resp = http.request(
        "POST",
        GROQ_URL,
        body=payload,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        timeout=25.0
    )

    if resp.status == 429:
        raise Exception("Groq rate limit alcanzado")

    if resp.status != 200:
        raise Exception(f"Error de Groq: {resp.status} - {resp.data}")

    result = json.loads(resp.data.decode('utf-8'))
    content = result['choices'][0]['message']['content']
    parsed = json.loads(content)

    questions = []
    for q in parsed.get('questions', []):
        q['questionId'] = str(uuid.uuid4())
        questions.append(q)

    return questions


def response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": HEADERS,
        "body": json.dumps(body_dict)
    }
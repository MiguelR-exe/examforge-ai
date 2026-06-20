import json
import os
import boto3
import urllib3
import uuid
from datetime import datetime, timezone

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
http = urllib3.PoolManager()

DOCUMENTS_TABLE = os.environ.get('DOCUMENTS_TABLE', 'Documents')
TOPICS_TABLE = os.environ.get('TOPICS_TABLE', 'Topics')
GROQ_API_KEY = os.environ['GROQ_API_KEY']
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

documents_table = dynamodb.Table(DOCUMENTS_TABLE)
topics_table = dynamodb.Table(TOPICS_TABLE)


def lambda_handler(event, context):
    for record in event['Records']:
        process_message(record)
    return {"statusCode": 200}


def process_message(record):
    body = json.loads(record['body'])

    # El body viene de EventBridge -> SQS, la info real está en 'detail'
    detail = body.get('detail', body)
    bucket_name = detail['bucket']['name']
    object_key = detail['object']['key']

    # IMPORTANTE: el evento de S3 entregado vía EventBridge NO incluye la
    # metadata personalizada del objeto (solo key, size, etag, sequencer).
    # Por eso consultamos la metadata directo desde S3 con head_object.
    head = s3.head_object(Bucket=bucket_name, Key=object_key)
    user_id = head.get('Metadata', {}).get('userid', 'unknown')

    document_id = str(uuid.uuid4())

    print(f"Procesando: bucket={bucket_name}, key={object_key}, userId={user_id}, documentId={document_id}")

    # 1. Descargar el archivo de S3 (a /tmp, espacio temporal de Lambda)
    local_path = f"/tmp/{os.path.basename(object_key)}"
    s3.download_file(bucket_name, object_key, local_path)

    # 2. Extraer texto del PDF
    text = extract_text(local_path)

    if not text.strip():
        raise Exception(f"No se pudo extraer texto de {object_key}")

    # 3. Llamar a Groq para analizar el contenido
    analysis = call_groq(text)

    # 4. Guardar el documento procesado, ya con el userId que lo subió
    documents_table.put_item(Item={
        'documentId': document_id,
        'userId': user_id,
        'bucketKey': object_key,
        'status': 'ANALYZED',
        'createdAt': datetime.now(timezone.utc).isoformat()
    })

    # 5. Guardar cada tema detectado
    for topic in analysis.get('topics', []):
        topics_table.put_item(Item={
            'documentId': document_id,
            'topicId': str(uuid.uuid4()),
            'name': topic.get('name'),
            'difficulty': topic.get('difficulty', 'intermedio'),
            'prerequisites': topic.get('prerequisites', [])
        })

    print(f"Documento {document_id} procesado con {len(analysis.get('topics', []))} temas")


def extract_text(file_path):
    # Requiere pypdf empaquetado junto al código (no viene preinstalado en Lambda)
    from pypdf import PdfReader
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def call_groq(text):
    # Trunca el texto si es muy largo para no exceder límites de tokens
    truncated_text = text[:15000]

    prompt = f"""Analiza el siguiente material académico y extrae los temas principales.
Responde SOLO con un JSON válido, sin texto adicional, con este formato exacto:
{{
  "topics": [
    {{"name": "nombre del tema", "difficulty": "facil|intermedio|avanzado", "prerequisites": ["tema previo"]}}
  ]
}}

Material:
{truncated_text}
"""

    payload = json.dumps({
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "response_format": {"type": "json_object"}
    })

    response = http.request(
        "POST",
        GROQ_URL,
        body=payload,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        timeout=30.0
    )

    if response.status == 429:
        # Rate limit - lanzamos excepción para que SQS reintente automáticamente
        raise Exception("Groq rate limit alcanzado, reintentando via SQS")

    if response.status != 200:
        raise Exception(f"Error de Groq: {response.status} - {response.data}")

    result = json.loads(response.data.decode('utf-8'))
    content = result['choices'][0]['message']['content']
    return json.loads(content)
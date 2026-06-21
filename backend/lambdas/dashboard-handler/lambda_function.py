import json
import os
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

RESULTS_TABLE = os.environ.get('RESULTS_TABLE', 'Results')
DOCUMENTS_TABLE = os.environ.get('DOCUMENTS_TABLE', 'Documents')

results_table = dynamodb.Table(RESULTS_TABLE)
documents_table = dynamodb.Table(DOCUMENTS_TABLE)

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}


def lambda_handler(event, context):
    try:
        path_params = event.get('pathParameters') or {}
        user_id = path_params.get('userId')

        if not user_id:
            return response(400, {"error": "userId es requerido"})

        return get_dashboard(user_id)

    except Exception as e:
        print(f"Error: {str(e)}")
        return response(500, {"error": str(e)})


def get_dashboard(user_id):
    results = results_table.query(
        KeyConditionExpression=Key('userId').eq(user_id)
    ).get('Items', [])

    total_quizzes = len(results)
    if total_quizzes > 0:
        avg_score = sum(float(r.get('score', 0)) for r in results) / total_quizzes
        avg_score = round(avg_score, 1)
    else:
        avg_score = 0

    all_documents = documents_table.scan().get('Items', [])
    user_documents = [d for d in all_documents if d.get('userId') == user_id]

    documents_list = [
        {
            "documentId": d.get('documentId'),
            "bucketKey": d.get('bucketKey'),
            "status": d.get('status'),
            "createdAt": d.get('createdAt')
        }
        for d in user_documents
    ]

    history = sorted(
        [
            {
                "quizId": r.get('quizId'),
                "documentId": r.get('documentId'),
                "score": float(r.get('score', 0)),
                "correctCount": int(r.get('correctCount', 0)),
                "totalQuestions": int(r.get('totalQuestions', 0)),
                "completedAt": int(r.get('completedAt', 0))
            }
            for r in results
        ],
        key=lambda x: x['completedAt'],
        reverse=True
    )

    return response(200, {
        "userId": user_id,
        "totalQuizzes": total_quizzes,
        "averageScore": avg_score,
        "totalDocumentsUploaded": len(user_documents),
        "documents": documents_list,
        "history": history
    })


def response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": HEADERS,
        "body": json.dumps(body_dict)
    }
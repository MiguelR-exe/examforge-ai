import json
import os
import boto3
from botocore.config import Config

s3 = boto3.client(
    's3',
    config=Config(signature_version='s3v4'),
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

BUCKET_NAME = os.environ.get('UPLOAD_BUCKET', 'examforge-uploads-hack')
URL_EXPIRATION = 300  # 5 minutos para subir el archivo

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}


def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body') or '{}')
        file_name = body.get('fileName')
        content_type = body.get('contentType', 'application/pdf')
        user_id = body.get('userId')

        if not file_name:
            return response(400, {"error": "fileName es requerido"})

        if not user_id:
            return response(400, {"error": "userId es requerido"})

        object_key = file_name

        params = {
            'Bucket': BUCKET_NAME,
            'Key': object_key,
            'ContentType': content_type,
            # La metadata viaja con el objeto en S3. IMPORTANTE: el frontend
            # debe mandar el header x-amz-meta-userid en el PUT a esta URL,
            # o la firma de la URL prefirmada no va a coincidir.
            'Metadata': {
                'userid': user_id
            }
        }

        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params=params,
            ExpiresIn=URL_EXPIRATION
        )

        return response(200, {
            "uploadUrl": presigned_url,
            "key": object_key,
            "bucket": BUCKET_NAME
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return response(500, {"error": str(e)})


def response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": HEADERS,
        "body": json.dumps(body_dict)
    }
import json
import os
import hmac
import hashlib
import base64
import time
import boto3

dynamodb = boto3.resource('dynamodb')
USERS_TABLE = os.environ.get('USERS_TABLE', 'Users')
JWT_SECRET = os.environ['JWT_SECRET']
users_table = dynamodb.Table(USERS_TABLE)

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}


def lambda_handler(event, context):
    try:
        path = event.get('path', '') or event.get('resource', '')
        body = json.loads(event.get('body') or '{}')

        if path.endswith('/register'):
            return register(body)
        elif path.endswith('/login'):
            return login(body)
        else:
            return response(404, {"error": "Ruta no encontrada"})

    except Exception as e:
        print(f"Error: {str(e)}")
        return response(500, {"error": str(e)})


def register(body):
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    name = body.get('name', '')

    if not email or not password:
        return response(400, {"error": "email y password son requeridos"})

    if len(password) < 6:
        return response(400, {"error": "password debe tener al menos 6 caracteres"})

    existing = users_table.get_item(Key={'userId': email})
    if 'Item' in existing:
        return response(409, {"error": "El usuario ya existe"})

    salt = os.urandom(16)
    password_hash = hash_password(password, salt)

    users_table.put_item(Item={
        'userId': email,
        'name': name,
        'passwordHash': password_hash,
        'salt': base64.b64encode(salt).decode('utf-8'),
        'createdAt': int(time.time())
    })

    token = generate_jwt({'sub': email, 'name': name})
    return response(201, {"token": token, "user": {"email": email, "name": name}})


def login(body):
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email or not password:
        return response(400, {"error": "email y password son requeridos"})

    result = users_table.get_item(Key={'userId': email})
    user = result.get('Item')

    if not user:
        return response(401, {"error": "Credenciales inválidas"})

    salt = base64.b64decode(user['salt'])
    password_hash = hash_password(password, salt)

    if password_hash != user['passwordHash']:
        return response(401, {"error": "Credenciales inválidas"})

    token = generate_jwt({'sub': email, 'name': user.get('name', '')})
    return response(200, {"token": token, "user": {"email": email, "name": user.get('name', '')}})


def hash_password(password, salt):
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(dk).decode('utf-8')


def base64url_encode(data):
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')


def generate_jwt(payload, expires_in=86400):
    header = {"alg": "HS256", "typ": "JWT"}
    payload = dict(payload)
    payload['exp'] = int(time.time()) + expires_in
    payload['iat'] = int(time.time())

    header_b64 = base64url_encode(json.dumps(header).encode('utf-8'))
    payload_b64 = base64url_encode(json.dumps(payload).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    signature_b64 = base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def verify_jwt(token):
    """Reutilizable por otras Lambdas (QuizHandler, DashboardHandler) para
    validar el token mandado en el header Authorization."""
    try:
        header_b64, payload_b64, signature_b64 = token.split('.')
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
        expected_sig_b64 = base64url_encode(expected_sig)

        if not hmac.compare_digest(signature_b64, expected_sig_b64):
            return None

        padded = payload_b64 + '=' * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))

        if payload.get('exp', 0) < time.time():
            return None

        return payload
    except Exception:
        return None


def response(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": HEADERS,
        "body": json.dumps(body_dict)
    }
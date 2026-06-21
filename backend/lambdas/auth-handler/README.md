# AuthHandler

## Qué hace

Maneja registro y login de usuarios sin depender de Amazon Cognito (que en AWS Academy Learner Lab suele tener restricciones de permisos IAM para crear sus propios roles). Genera tokens JWT propios, firmados a mano con `hmac` + `sha256`, usando únicamente librerías estándar de Python.

## Decisión de diseño: `email` como `userId`

La tabla `Users` usa `userId` como partition key, sin índice secundario por email. Para evitar complicar el diseño con un GSI durante la hackathon, se usa el email directamente como `userId`. Esto permite hacer `get_item` directo (rápido) en login/registro, en vez de un `scan` (lento).

## Trigger

- **Tipo:** API Gateway (REST API, integración Lambda Proxy)
- **Rutas:**
  - `POST /auth/register`
  - `POST /auth/login`

## Variables de entorno

| Variable | Valor de ejemplo | Descripción |
|---|---|---|
| `USERS_TABLE` | `Users` | Tabla DynamoDB de usuarios |
| `JWT_SECRET` | string largo y aleatorio | Secreto usado para firmar/verificar los JWT. Debe ser el mismo valor en `QuizHandler` y `DashboardHandler` si en el futuro validan el token. |

## Configuración de la función

- **Runtime:** Python 3.12+
- **Timeout:** 10 segundos
- **Rol de ejecución:** `LabRole` (AWS Academy)

No necesita librerías externas — todo el JWT está implementado a mano con `hmac`, `hashlib`, `base64`, `json`, que ya vienen en el runtime estándar de Python.

## Seguridad de contraseñas

Las contraseñas nunca se guardan en texto plano. Se usa `PBKDF2-HMAC-SHA256` con 100,000 iteraciones y un salt aleatorio de 16 bytes por usuario, generado con `os.urandom`.

## Requests

### Registro

```json
POST /auth/register
Content-Type: application/json

{
  "email": "estudiante@correo.com",
  "password": "minimo6caracteres",
  "name": "Nombre Estudiante"
}
```

### Login

```json
POST /auth/login
Content-Type: application/json

{
  "email": "estudiante@correo.com",
  "password": "minimo6caracteres"
}
```

### Response (ambos casos)

```json
{
  "token": "eyJhbGciOiAiSFMyNTYi...",
  "user": {
    "email": "estudiante@correo.com",
    "name": "Nombre Estudiante"
  }
}
```

El frontend debe guardar el `token` y mandarlo en el header `Authorization` en las siguientes llamadas a endpoints protegidos.

## Función reutilizable: `verify_jwt`

El archivo incluye una función `verify_jwt(token)` que valida la firma y la expiración de un token. No se usa dentro de esta misma Lambda, pero está pensada para copiarse/reutilizarse en `QuizHandler` o `DashboardHandler` si se quiere proteger esos endpoints validando el header `Authorization`.

## Probar manualmente

```bash
curl -X POST "https://g9hq7aukf3.execute-api.us-east-1.amazonaws.com/dev/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456", "name": "Estudiante Test"}'

curl -X POST "https://g9hq7aukf3.execute-api.us-east-1.amazonaws.com/dev/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456"}'
```
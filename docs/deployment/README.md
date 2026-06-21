# Despliegue Local

El despliegue local está explicado en el README dentro de frontend. (./frontend/README.md)

# Manual de despliegue desde 0

Guía paso a paso para desplegar y probar ExamForge AI desde cero.

## Requisitos previos

- Cuenta de AWS con permisos para Lambda, SQS, EventBridge, S3 e IAM.
- AWS CLI configurado (`aws configure`).
- Node.js 18+ y npm.
- Python 3.11+ (para las Lambdas).
- Una API key de Groq: https://console.groq.com/keys

## 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelR-exe/examforge-ai.git
cd examforge-ai
```

## 2. Configurar variables de entorno del backend

En cada función dentro de `backend/lambdas/` (o en un archivo `.env`/parámetros de despliegue centralizado), definir:

```
GROQ_API_KEY=<tu-api-key-de-groq>
SQS_QUEUE_URL=<url-de-la-cola-principal>
SQS_DLQ_URL=<url-de-la-dead-letter-queue>
S3_BUCKET_NAME=<bucket-para-documentos>
DB_TABLE_NAME=<nombre-de-tabla/recurso-de-base-de-datos>
```

## 3. Desplegar la infraestructura de eventos

1. Crear el bucket S3 para los documentos subidos.
2. Crear la cola SQS principal y su Dead Letter Queue (DLQ), con una política de redrive (`maxReceiveCount`, p. ej. 3-5 intentos).
3. Configurar la regla de EventBridge (o notificación de S3) que dispara `document-processor` cuando se sube un nuevo archivo.

_(Completar aquí con los comandos exactos de `aws cli` / IaC usados, p. ej. CloudFormation, SAM, Terraform o Serverless Framework — según lo que se haya usado en el proyecto.)_

## 4. Desplegar las funciones Lambda

Para cada carpeta en `backend/lambdas/` (`auth-handler`, `upload-handler`, `document-processor`, `quiz-handler`, `dashboard-handler`):

```bash
cd backend/lambdas/<nombre-de-la-funcion>
pip install -r requirements.txt -t .
zip -r function.zip .
aws lambda create-function \
  --function-name examforge-<nombre-de-la-funcion> \
  --runtime python3.11 \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --role <ARN-del-rol-IAM> \
  --environment Variables="{GROQ_API_KEY=...,SQS_QUEUE_URL=...}"
```

Conectar `quiz-handler` como consumidor (trigger) de la cola SQS principal.

## 5. Configurar y desplegar el frontend

```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con la URL del API Gateway / endpoints de las Lambdas
npm run build
```

Desplegar el contenido de `dist/` según el hosting elegido (S3+CloudFront, Amplify, Vercel, etc.). Ver detalle en [`../../frontend/README.md`](../../frontend/README.md).

## 6. Probar el flujo completo

1. Abrir la URL del frontend desplegado.
2. Registrar un usuario y hacer login.
3. Subir un documento de prueba (PDF/TXT).
4. Verificar en el Dashboard que el documento pasa a estado "procesando" y luego "listo".
5. Resolver el quiz generado.
6. Verificar la pantalla de resultados con el puntaje y repaso de preguntas.

## 7. Verificar resiliencia

- Forzar varias subidas simultáneas para generar múltiples lotes en paralelo.
- Revisar en CloudWatch Logs que, ante un error 429 de Groq, el mensaje vuelve a la cola y se reintenta sin pérdida de datos.
- Revisar la Dead Letter Queue tras agotar los reintentos máximos.

## Troubleshooting

| Problema | Posible causa | Solución |
|---|---|---|
| El frontend no recibe respuesta | `VITE_API_BASE_URL` mal configurada | Revisar `.env` del frontend |
| El quiz nunca se genera | API key de Groq inválida o cuota agotada | Revisar `GROQ_API_KEY` y límites de la cuenta |
| Documento subido pero sin evento disparado | Notificación de S3/EventBridge no configurada | Revisar la regla de eventos sobre el bucket |
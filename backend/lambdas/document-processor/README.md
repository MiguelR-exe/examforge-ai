# DocumentProcessor

## Qué hace

Es el corazón del pipeline de eventos. Se dispara automáticamente cuando un PDF nuevo llega al bucket S3 de uploads. Descarga el archivo, extrae su texto, lo envía a Groq (LLM) para detectar los temas principales del material académico, y guarda los resultados en DynamoDB.

## Flujo que la activa

```
S3 (PutObject) → EventBridge (regla DocumentUploadedRule) → SQS (ProcessingQueue) → DocumentProcessor
```

No se invoca directamente desde el frontend ni desde API Gateway. Solo reacciona a mensajes de la cola SQS.

## Trigger

- **Tipo:** SQS
- **Cola:** `ExamForge-ProcessingQueue`
- **Batch size:** 1 (procesa un documento a la vez, más fácil de depurar y evita que un PDF problemático bloquee el resto del lote)
- **Dead Letter Queue:** `ExamForge-ProcessingDLQ`, configurada en la cola con `Maximum receives: 3`. Si la Lambda falla 3 veces seguidas con el mismo mensaje (timeout, error de Groq, PDF corrupto, etc.), el mensaje se mueve automáticamente a la DLQ sin perder el documento ni bloquear el resto del lote.

## Variables de entorno

| Variable | Valor de ejemplo | Descripción |
|---|---|---|
| `DOCUMENTS_TABLE` | `Documents` | Tabla DynamoDB donde se guarda el documento procesado |
| `TOPICS_TABLE` | `Topics` | Tabla DynamoDB donde se guardan los temas detectados |
| `GROQ_API_KEY` | `gsk_...` | API key de [Groq](https://console.groq.com/keys) |

## Configuración de la función

- **Runtime:** Python 3.12+ (probado en 3.14)
- **Timeout:** 120 segundos (la extracción de PDF + llamada a Groq puede tardar)
- **Memoria:** 512 MB
- **Rol de ejecución:** en AWS Academy, usar `LabRole` (no se pueden crear roles IAM nuevos)

⚠️ El **visibility timeout** de `ExamForge-ProcessingQueue` debe ser mayor al timeout de esta Lambda (se configuró en 150 segundos). Si no, AWS bloquea la creación del trigger con el error `Queue visibility timeout is less than Function timeout`.

## Dependencia externa: pypdf

Esta es la única Lambda del proyecto que necesita una librería que no viene preinstalada en el runtime de Lambda (`pypdf`, para leer el contenido de los PDFs). Por eso no se puede simplemente pegar el código en el editor inline de la consola — hay que empaquetarlo junto con sus dependencias en un `.zip`.

### Cómo empaquetar y desplegar (vía AWS CloudShell)

```bash
mkdir lambda-package && cd lambda-package
python3 -m pip install -r requirements.txt -t .
cp /ruta/a/lambda_function.py .
zip -r function.zip .
aws lambda update-function-code --function-name DocumentProcessor --zip-file fileb://function.zip
```

Verificar que el despliegue terminó:

```bash
aws lambda get-function --function-name DocumentProcessor --query 'Configuration.LastUpdateStatus'
```

Debe decir `"Successful"`.

## Detalle importante: cómo se obtiene el `userId`

El evento de "Object Created" que S3 envía a EventBridge **no incluye la metadata personalizada del objeto** (solo `key`, `size`, `etag`, `sequencer`). Por eso, en vez de leer el `userId` directo del evento, la función hace una llamada extra a `s3.head_object()` para consultar la metadata real del objeto antes de procesarlo:

```python
head = s3.head_object(Bucket=bucket_name, Key=object_key)
user_id = head.get('Metadata', {}).get('userid', 'unknown')
```

Esa metadata (`x-amz-meta-userid`) la define `UploadHandler` al generar la URL prefirmada, y el frontend debe mandarla como header al hacer el `PUT` del archivo a S3.

## Manejo de errores y reintentos (resiliencia)

- Si Groq devuelve `429` (rate limit), la función lanza una excepción a propósito → SQS reintenta el mensaje automáticamente.
- Si el PDF está corrupto o no tiene texto extraíble, también se lanza una excepción → mismo mecanismo de reintento.
- Después de 3 intentos fallidos, el mensaje cae a la DLQ sin perder el documento ni bloquear el procesamiento de los demás mensajes en la cola.

## Probar manualmente

Subir cualquier PDF al bucket de uploads dispara el flujo automáticamente. Para ver los logs:

```bash
aws logs tail /aws/lambda/DocumentProcessor --follow
```
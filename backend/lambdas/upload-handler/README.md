# UploadHandler

## Qué hace

Genera una URL prefirmada (presigned URL) de S3 para que el frontend pueda subir un PDF directamente al bucket, sin que el archivo pase por esta Lambda ni por API Gateway. Esto evita los límites de tamaño de payload de API Gateway y es más rápido para archivos grandes.

## Trigger

- **Tipo:** API Gateway (REST API, integración Lambda Proxy)
- **Ruta:** `POST /documents/upload-url`

## Variables de entorno

| Variable | Valor de ejemplo | Descripción |
|---|---|---|
| `UPLOAD_BUCKET` | `examforge-uploads-hack` | Nombre del bucket S3 donde se suben los documentos |

## Configuración de la función

- **Runtime:** Python 3.12+
- **Timeout:** 10 segundos (solo genera una URL, no hace trabajo pesado)
- **Rol de ejecución:** `LabRole` (AWS Academy)

No necesita librerías externas — solo `boto3`, que ya viene incluido en el runtime de Lambda. Se puede escribir y desplegar directo en el editor inline de la consola.

## Request

```json
POST /documents/upload-url
Content-Type: application/json

{
  "fileName": "apuntes.pdf",
  "contentType": "application/pdf",
  "userId": "estudiante@correo.com"
}
```

## Response

```json
{
  "uploadUrl": "https://examforge-uploads-hack.s3.amazonaws.com/apuntes.pdf?X-Amz-...",
  "key": "apuntes.pdf",
  "bucket": "examforge-uploads-hack"
}
```

## Cómo usarla desde el frontend

1. El frontend llama a este endpoint con el nombre del archivo, su content type, y el `userId` del usuario logueado.
2. Recibe `uploadUrl`.
3. El frontend hace un `PUT` **directo a esa `uploadUrl`** (no a este endpoint) con el archivo binario como body.
4. ⚠️ **Importante:** el `PUT` debe incluir el header `x-amz-meta-userid` con el mismo valor de `userId` que se mandó en el paso 1. Si no se incluye, la firma de la URL prefirmada no coincide y S3 rechaza la subida con error de firma.

```js
// Ejemplo de PUT desde el frontend
await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/pdf',
    'x-amz-meta-userid': userId
  },
  body: fileBlob
});
```

Ese `PUT` exitoso dispara automáticamente todo el pipeline de eventos: S3 → EventBridge → SQS → `DocumentProcessor`.

## Probar manualmente

```bash
curl -X POST "https://g9hq7aukf3.execute-api.us-east-1.amazonaws.com/dev/documents/upload-url" \
  -H "Content-Type: application/json" \
  -d '{"fileName": "test.pdf", "contentType": "application/pdf", "userId": "test@test.com"}'
```
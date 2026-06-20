# DashboardHandler

## Qué hace

Agrega y devuelve las estadísticas de un usuario: cuántos quizzes ha hecho, su promedio de aciertos, qué documentos ha subido, y el historial completo de intentos ordenado del más reciente al más antiguo.

## Trigger

- **Tipo:** API Gateway (REST API, integración Lambda Proxy)
- **Ruta:** `GET /dashboard/{userId}`

## Variables de entorno

| Variable | Valor de ejemplo | Descripción |
|---|---|---|
| `RESULTS_TABLE` | `Results` | Tabla de resultados de quizzes |
| `DOCUMENTS_TABLE` | `Documents` | Tabla de documentos procesados |

## Configuración de la función

- **Runtime:** Python 3.12+
- **Timeout:** 10 segundos (solo lee de DynamoDB, no llama a Groq)
- **Rol de ejecución:** `LabRole` (AWS Academy)

Solo usa `boto3`. No requiere empaquetado especial.

## Request

```
GET /dashboard/{userId}
```

Ejemplo: `GET /dashboard/estudiante@correo.com`

## Response

```json
{
  "userId": "estudiante@correo.com",
  "totalQuizzes": 1,
  "averageScore": 100.0,
  "totalDocumentsUploaded": 1,
  "documents": [
    {
      "documentId": "53f0c1e8-...",
      "bucketKey": "08 - Ejercicios BTree-1.pdf",
      "status": "ANALYZED",
      "createdAt": "2026-06-20T18:27:39.726000+00:00"
    }
  ],
  "history": [
    {
      "quizId": "d6116e15-...",
      "documentId": "53f0c1e8-...",
      "score": 100.0,
      "correctCount": 3,
      "totalQuestions": 3,
      "completedAt": 1781985372
    }
  ]
}
```

## Nota técnica: por qué se usa `scan()` en vez de `query()` para Documents

La tabla `Documents` usa `documentId` como partition key, no `userId`. DynamoDB solo permite `query()` eficiente sobre la partition key o un índice secundario (GSI). Como no existe un GSI sobre `userId`, esta función hace un `scan()` completo de la tabla y filtra en memoria:

```python
all_documents = documents_table.scan().get('Items', [])
user_documents = [d for d in all_documents if d.get('userId') == user_id]
```

**Esto es una decisión consciente de alcance para una hackathon, no un descuido:** con decenas de documentos de prueba el `scan()` es instantáneo e invisible en performance. En un escenario de producción con miles o millones de documentos, esto se reemplazaría por un GSI sobre `userId` para poder usar `query()` y evitar leer la tabla completa en cada consulta del dashboard.

## Probar manualmente

```bash
curl -X GET "https://TU_API_ID.execute-api.us-east-1.amazonaws.com/dev/dashboard/test@test.com"
```
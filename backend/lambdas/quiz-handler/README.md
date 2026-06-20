# QuizHandler

## Qué hace

Tiene tres responsabilidades relacionadas con los quizzes generados a partir de los temas que `DocumentProcessor` ya extrajo de cada PDF:

1. **Generar** un quiz nuevo con preguntas de opción múltiple, usando Groq.
2. **Servir** un quiz existente (sin revelar las respuestas correctas).
3. **Calificar** las respuestas que envía el estudiante y guardar el resultado.

## Trigger

- **Tipo:** API Gateway (REST API, integración Lambda Proxy)
- **Rutas:**
  - `POST /quizzes/generate`
  - `GET /quizzes/{quizId}`
  - `POST /quizzes/{quizId}/submit`

## Variables de entorno

| Variable | Valor de ejemplo | Descripción |
|---|---|---|
| `TOPICS_TABLE` | `Topics` | Tabla de temas extraídos por `DocumentProcessor` |
| `QUIZZES_TABLE` | `Quizzes` | Tabla donde se guardan las preguntas generadas |
| `RESULTS_TABLE` | `Results` | Tabla donde se guardan los resultados de cada intento |
| `JWT_SECRET` | mismo valor que en `AuthHandler` | Reservado para validar tokens si se decide proteger estos endpoints |
| `GROQ_API_KEY` | `gsk_...` | API key de Groq |

## Configuración de la función

- **Runtime:** Python 3.12+
- **Timeout:** 30 segundos (llama a Groq, similar a `DocumentProcessor`)
- **Rol de ejecución:** `LabRole` (AWS Academy)

Solo usa `boto3` y `urllib3` (incluidos en el runtime). No requiere empaquetado especial.

## Requests

### 1. Generar quiz

```json
POST /quizzes/generate
Content-Type: application/json

{
  "documentId": "53f0c1e8-bb40-4fcb-ba6c-73882d732ba1",
  "numQuestions": 5,
  "difficulty": "intermedio"
}
```

Respuesta (sin respuestas correctas):

```json
{
  "quizId": "d6116e15-c1ca-4b47-be9e-082f4962e75d",
  "questions": [
    {
      "questionId": "221e52fa-...",
      "question": "¿Cuál es el propósito principal de un árbol B-Tree?",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."}
    }
  ]
}
```

### 2. Obtener un quiz existente

```
GET /quizzes/{quizId}
```

Misma estructura de respuesta que `generate`, también sin respuestas correctas.

### 3. Enviar respuestas y calificar

```json
POST /quizzes/{quizId}/submit
Content-Type: application/json

{
  "userId": "estudiante@correo.com",
  "answers": {
    "221e52fa-...": "B",
    "08ea9220-...": "C"
  }
}
```

Respuesta (aquí sí se revelan las respuestas correctas, porque ya se calificó):

```json
{
  "score": 100.0,
  "correctCount": 3,
  "totalQuestions": 3,
  "detail": [
    {
      "questionId": "221e52fa-...",
      "yourAnswer": "B",
      "correctAnswer": "B",
      "isCorrect": true,
      "explanation": "..."
    }
  ]
}
```

## Por qué nunca se exponen las respuestas correctas antes de calificar

Tanto `generate_quiz` como `get_quiz` filtran explícitamente el campo `correctAnswer` y `explanation` antes de responder. Si se devolvieran completos, cualquier persona podría ver las respuestas correctas inspeccionando la respuesta de red en el navegador antes de contestar.

## Detalle técnico: por qué se usa `Decimal` en vez de `float`

DynamoDB (vía `boto3`) no acepta tipos `float` nativos de Python al guardar ítems — lanza el error `Float types are not supported. Use Decimal types instead.` Por eso el `score` se calcula como `float` para la lógica, pero se convierte a `Decimal` justo antes de guardarlo:

```python
score = Decimal(str(round((correct_count / total) * 100, 1))) if total > 0 else Decimal(0)
```

Y se vuelve a convertir a `float` solo al armar la respuesta JSON (porque `json.dumps` no sabe serializar `Decimal`):

```python
return response(200, {"score": float(score), ...})
```

## Probar manualmente

```bash
curl -X POST "https://TU_API_ID.execute-api.us-east-1.amazonaws.com/dev/quizzes/generate" \
  -H "Content-Type: application/json" \
  -d '{"documentId": "TU_DOCUMENT_ID", "numQuestions": 3, "difficulty": "intermedio"}'
```
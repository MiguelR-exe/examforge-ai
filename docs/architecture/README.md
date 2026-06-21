# Diagrama y diseño de arquitectura

> El diagrama gráfico (imagen) se encuentra en [`infra/architecture-diagram.png`](../../infra/architecture-diagram.png). Este documento explica el flujo representado en esa imagen.

## Flujo de eventos

```
[Usuario]
   │  (1) Login/Register
   ▼
[Frontend - React SPA]
   │  (2) Sube documento
   ▼
[upload-handler (Lambda)]
   │  (3) Guarda archivo en S3
   │  (4) Publica evento "documento subido"
   ▼
[S3 bucket] ──(evento)──▶ [EventBridge / SQS]
   │
   ▼
[document-processor (Lambda)]
   │  (5) Extrae texto del documento
   │  (6) Divide el contenido en lotes de 20-30 elementos
   │  (7) Publica un mensaje por lote en una cola SQS
   ▼
[SQS - cola de lotes]
   │
   ▼
[quiz-handler (Lambda, consumer)]
   │  (8) Por cada lote, llama a la API de Groq (LLM) para generar preguntas
   │  (9) Si Groq responde con rate limit/error transitorio:
   │        - No se confirma (ACK) el mensaje
   │        - SQS lo reintenta automáticamente (visibility timeout + backoff)
   │        - Tras N intentos fallidos → Dead Letter Queue (DLQ)
   │  (10) Si tiene éxito, guarda las preguntas generadas en la base de datos
   ▼
[Base de datos de quizzes/resultados]
   │
   ▼
[dashboard-handler (Lambda)]
   │  (11) Expone el estado del procesamiento y resultados al frontend
   ▼
[Frontend - Dashboard / Quiz / Results]
```

## Por qué es event-driven y asíncrona

- Cada subida de documento genera un **evento** independiente, no una llamada síncrona bloqueante.
- El procesamiento por lotes (20–30 elementos) se modela como **mensajes independientes en una cola**, no como un loop secuencial dentro de una sola función.
- El consumidor (`quiz-handler`) procesa los mensajes de forma desacoplada del resto del sistema: si falla, el mensaje permanece en la cola para reintento, sin afectar a otros lotes ni al frontend.
- El frontend nunca espera de forma síncrona una respuesta larga del LLM: consulta el estado vía `dashboard-handler` (polling) una vez que el procesamiento asíncrono termina.

## Componentes de nube utilizados

| Componente | Servicio | Rol |
|---|---|---|
| Cómputo | AWS Lambda | Toda la lógica de backend (serverless) |
| Mensajería/eventos | Amazon SQS + EventBridge | Desacoplar y encolar el procesamiento por lotes |
| Almacenamiento de archivos | Amazon S3 | Guardar los documentos subidos |
| Base de datos | _[completar: DynamoDB / RDS / etc.]_ | Persistir usuarios, documentos, quizzes y resultados |
| LLM | API de Groq | Generación de preguntas a partir del texto |
| Frontend hosting | _[completar: S3+CloudFront / Amplify / Vercel]_ | Servir la SPA |

## Excepciones a "serverless puro"

_[Si no se usó ninguna VM/Docker, indicar explícitamente: "No se utilizó ninguna VM ni contenedor Docker; toda la arquitectura es 100% serverless." Si se usó, justificar aquí el motivo (p. ej. base de datos vectorial para RAG) y enlazar el `docker-compose.yml`.]_
# Infraestructura

Esta carpeta contiene los artefactos relacionados con la infraestructura y el diseño de eventos de ExamForge AI.

## Contenido

- `architecture-diagram.png` — Diagrama gráfico de la arquitectura de la solución (referenciado desde [`docs/architecture/README.md`](../docs/architecture/README.md) y desde el README principal).
- `event-patterns/` — Definiciones de los eventos/mensajes usados en el flujo asíncrono: estructura de los mensajes de SQS, reglas de EventBridge y políticas de reintento/DLQ.

## Eventos principales del sistema

| Evento | Origen | Destino | Descripción |
|---|---|---|---|
| `document.uploaded` | `upload-handler` | EventBridge / S3 trigger | Se dispara al subir un documento nuevo |
| `document.batch.created` | `document-processor` | SQS (cola principal) | Un mensaje por cada lote de 20-30 elementos a procesar |
| `quiz.batch.failed` | `quiz-handler` | SQS (retry) → DLQ | Se genera cuando la API del LLM falla; el mensaje se reintenta o termina en la DLQ |
| `quiz.ready` | `quiz-handler` | Base de datos / `dashboard-handler` | Indica que el quiz de un documento ya está disponible |

## Política de reintentos (resumen)

- Visibility timeout configurado para dar tiempo a la Lambda a procesar el lote.
- Reintentos automáticos gestionados por SQS ante fallos no confirmados.
- `maxReceiveCount` definido para mover mensajes fallidos repetidamente a la **Dead Letter Queue**, evitando pérdida de datos y bucles infinitos.
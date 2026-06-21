# ExamForge AI

> Generador automático de cuestionarios de estudio a partir de documentos, usando una arquitectura serverless basada en eventos e integración con un LLM (Groq).

**Hackathon:** Arquitectura Basada en Eventos e Integración con LLMs
**Equipo:** _[Ctrl+z]_
**Integrantes:** _[Miguel Ramos Bonilla, Fernando Espinoza Torres]_

---

## 🔗 Enlaces rápidos

| Recurso | Link |
|---|---|
| 🌐 Frontend desplegado | _[URL pública aquí]_ |
| 🎥 Video demo (Drive) | Ver [`demo/video-link.md`](./demo/video-link.md) |
| 📐 Diagrama de arquitectura | Ver [`docs/architecture/`](./docs/architecture/README.md) |
| 📖 Manual de despliegue | Ver [`docs/deployment/`](./docs/deployment/README.md) |
| 🧩 Contexto del problema | Ver [`docs/context/`](./docs/context/README.md) |

---

## 1. Contexto y problema real

Estudiar a partir de apuntes, PDFs o diapositivas es lento: convertir ese material en preguntas de autoevaluación toma tiempo y muchos estudiantes simplemente no lo hacen, lo que reduce la retención y el desempeño en exámenes.

**ExamForge AI** resuelve esto permitiendo que un usuario suba uno o varios documentos de estudio (PDF, slides, apuntes) y reciba automáticamente un cuestionario tipo quiz generado por un LLM, basado en el contenido real del documento. El usuario responde el quiz desde el frontend y obtiene retroalimentación inmediata con su puntaje y un repaso de cada pregunta.

Casos de uso principales:

- Estudiantes que quieren autoevaluarse rápidamente antes de un examen.
- Profesores que quieren generar baterías de preguntas a partir de su material de clase.
- Centros de capacitación que necesitan evaluar a varios participantes a partir del mismo contenido, de forma masiva.

Impacto esperado: reducir el tiempo de preparación de evaluaciones, fomentar el estudio activo (active recall) y permitir procesar múltiples documentos/preguntas de forma masiva sin que el usuario tenga que esperar bloqueando la interfaz.

📄 Documento ampliado de contexto: [`docs/context/README.md`](./docs/context/README.md)

---

## 2. Arquitectura de la solución

ExamForge AI sigue un flujo **asíncrono y orientado a eventos**, casi en su totalidad **serverless**, sobre AWS:

```
Usuario → Frontend (SPA) → API/Upload Handler → S3 (documento)
                                   │
                                   ▼
                          Evento (S3 → EventBridge/SQS)
                                   │
                                   ▼
                       Document Processor (Lambda)
                         - Extrae texto del documento
                         - Lo divide en lotes (20-30 elementos)
                         - Encola cada lote en SQS
                                   │
                                   ▼
                        Quiz Handler (Lambda, consumer SQS)
                         - Llama a la API de Groq (LLM)
                         - Si hay rate limit / error → retry con backoff
                           y el mensaje vuelve a la cola (visibility timeout)
                         - Guarda preguntas generadas en DB
                                   │
                                   ▼
                       Dashboard Handler (Lambda) ← Frontend hace polling/consulta
                         - Devuelve estado y resultados al usuario
```

Componentes:

- **Frontend (React + Vite + Tailwind)**: sube documentos, dispara el flujo, muestra el quiz y los resultados.
- **upload-handler**: recibe el archivo, lo guarda en S3 y publica el evento inicial.
- **document-processor**: procesa el documento y genera los eventos/lotes hacia la cola.
- **quiz-handler**: consume la cola, llama al LLM (Groq) y aplica reintentos controlados.
- **dashboard-handler**: expone el estado del procesamiento y los resultados finales.
- **auth-handler**: autenticación de usuarios.

📐 Diagrama gráfico completo: [`docs/architecture/README.md`](./docs/architecture/README.md) (ver `architecture-diagram.png` en `infra/`)

---

## 3. Resiliencia y manejo de límites de la API del LLM

- El documento se procesa en **lotes de 20 a 30 elementos** (preguntas/fragmentos), nunca todo de una sola vez.
- Cada lote se envía como un mensaje independiente a una cola (**SQS**), de forma asíncrona.
- Si la API de **Groq** responde con un error de rate limit (429) o un error transitorio:
  - La Lambda captura la excepción.
  - El mensaje **no se elimina** de la cola; se reintenta automáticamente usando el mecanismo de **visibility timeout** + **retry policy** de SQS (backoff incremental).
  - Tras un número máximo de intentos, el mensaje se mueve a una **Dead Letter Queue (DLQ)** para revisión, sin perder la data.
- Esto garantiza que un pico de tráfico o un límite temporal de la API no haga colapsar el procesamiento ni pierda información del usuario.

Más detalle de implementación en [`backend/lambdas/quiz-handler/`](./backend/lambdas/quiz-handler/).

---

## 4. Frontend

SPA construida en **React + Vite + TailwindCSS**.

Funcionalidades:

- Registro / login de usuario.
- Subida de documentos (`Upload.jsx`, `UploadZone.jsx`) con feedback de progreso.
- Dashboard con historial de documentos y quizzes (`Dashboard.jsx`).
- Resolución del quiz generado (`Quiz.jsx`, `QuestionCard.jsx`, navegación entre preguntas).
- Pantalla de resultados con puntaje y repaso pregunta por pregunta (`Results.jsx`).

🌐 URL pública: _[https://main.d2duzc8xkq38hs.amplifyapp.com/login]_

Instrucciones de instalación local y despliegue: [`frontend/README.md`](./frontend/README.md)

---

## 5. Estructura del repositorio

```
examforge-ai/
├── README.md                  ← este archivo
├── backend/lambdas/           ← funciones serverless (Python)
│   ├── auth-handler/
│   ├── upload-handler/
│   ├── document-processor/
│   ├── quiz-handler/
│   └── dashboard-handler/
├── frontend/                  ← SPA React (ver frontend/README.md)
├── infra/                     ← diagrama de arquitectura y patrones de eventos
├── docs/
│   ├── context/                ← documento de problemática e impacto
│   ├── architecture/           ← explicación detallada del diagrama
│   └── deployment/             ← manual paso a paso de despliegue
└── demo/
    └── video-link.md           ← link al video demo en YouTube
```

---

## 6. Despliegue rápido

Ver el manual completo en [`docs/deployment/README.md`](./docs/deployment/README.md). Resumen:

1. Clonar el repo: `git clone https://github.com/MiguelR-exe/examforge-ai.git`
2. Desplegar las Lambdas (`backend/lambdas/`) y la infraestructura de colas/eventos.
3. Configurar variables de entorno (incluida la API key de Groq).
4. Instalar y desplegar el frontend (ver [`frontend/README.md`](./frontend/README.md)).
5. Probar el flujo completo: registro → subida de documento → quiz → resultados.

---

## 7. Stack tecnológico

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: AWS Lambda (Python)
- **Eventos / mensajería**: Amazon SQS + EventBridge
- **Almacenamiento**: Amazon S3 (documentos), base de datos para usuarios/resultados
- **LLM**: API de Groq
- **Infraestructura**: Serverless (sin servidores dedicados, salvo excepción justificada en `infra/`)

---

## 8. Rúbrica — checklist de entregables

- [x] Documento de contexto de la problemática e impacto
- [x] Diagrama de arquitectura basada en eventos
- [x] Manejo de resiliencia y límites de API con reintentos vía cola
- [x] Enlace del frontend desplegado
- [x] Video demo en Drive
- [x] Manual de despliegue reproducible

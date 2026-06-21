# ExamForge AI — Frontend

SPA construida con **React + Vite + TailwindCSS** para subir documentos, lanzar el flujo de generación de quizzes y visualizar resultados.

## Estructura

```
frontend/
├── public/
├── src/
│   ├── assets/            # imágenes e iconos
│   ├── components/
│   │   ├── layout/        # Navbar, Sidebar, ProtectedRoute
│   │   ├── auth/           # LoginForm, RegisterForm
│   │   ├── dashboard/      # StatCard, DashboardStats, RecentDocuments, QuizHistory
│   │   ├── upload/         # UploadZone, UploadButton, UploadProgress
│   │   ├── quiz/           # QuestionCard, OptionButton, QuizNavigation
│   │   ├── result/         # ScoreCard, QuestionReview, ResultSummary
│   │   └── common/         # Button, Card, Modal, Loader, EmptyState
│   ├── pages/              # Login, Register, Dashboard, Upload, Quiz, Results, Profile
│   ├── services/           # api.js, authService.js, documentService.js, quizService.js
│   ├── context/            # AuthContext
│   ├── hooks/               # useAuth, useDashboard, useQuiz, useUpload
│   ├── routes/              # AppRoutes
│   ├── utils/                # constants, formatDate, storage, validators
│   └── styles/               # globals.css, theme.css
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Requisitos

- Node.js 18+
- npm 9+

## Variables de entorno

Crear un archivo `.env` en `frontend/` con:

```
VITE_API_BASE_URL=https://g9hq7aukf3.execute-api.us-east-1.amazonaws.com/dev
```

## Instalación local

```bash
cd frontend
npm install
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

## Build de producción

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para desplegar.

## Despliegue

_[Completar según dónde se desplegó: S3 + CloudFront / Amplify / Vercel, con los pasos exactos usados]_

Ejemplo genérico para S3 + CloudFront:

```bash
aws s3 sync dist/ s3://examforge-uploads-hack --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Flujo principal de la UI

1. **Login / Register** → autenticación contra `auth-handler`.
2. **Upload** → el usuario sube un documento, se invoca `upload-handler`, que dispara el flujo de eventos en el backend.
3. **Dashboard** → muestra el estado del procesamiento (polling a `dashboard-handler`) y el historial de documentos/quizzes.
4. **Quiz** → una vez generado el cuestionario, el usuario responde pregunta por pregunta.
5. **Results** → muestra el puntaje final y el repaso de cada pregunta (correcta/incorrecta + explicación).
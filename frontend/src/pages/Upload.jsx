import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useUpload } from "../hooks/useUpload";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import UploadZone from "../components/upload/UploadZone";
import UploadProgress from "../components/upload/UploadProgress";

export default function Upload() {
const navigate = useNavigate();
const { user } = useAuth();

const [file, setFile] = useState(null);

const {
upload,
stage,
error,
STAGES,
} = useUpload(user?.email);

const handleUpload = async () => {
if (!file) return;

try {
  await upload(file);
} catch (err) {
  console.error(err);
}

};

return ( <div className="mx-auto max-w-5xl">

  <div className="mb-8">

    <h1 className="font-display text-3xl font-bold text-ink">
      Crear nuevo material de estudio
    </h1>

    <p className="mt-2 text-ink-muted">
      Sube un PDF y ExamForge generará preguntas,
      evaluaciones y recomendaciones usando IA.
    </p>

  </div>

  <div className="grid gap-6 lg:grid-cols-3">

    <div className="lg:col-span-2">

      <Card className="p-6">

        <UploadZone
          onFileSelected={setFile}
          disabled={stage !== STAGES.IDLE}
        />

        {file && (
          <div className="mt-5 rounded-xl border border-base-border bg-base px-4 py-3">

            <div className="flex items-center gap-3">

              <span className="text-2xl">
                📄
              </span>

              <div>
                <p className="font-medium text-ink">
                  {file.name}
                </p>

                <p className="text-xs text-ink-faint">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

            </div>

          </div>
        )}

        {stage !== STAGES.IDLE &&
         stage !== STAGES.DONE && (
          <div className="mt-6">
            <UploadProgress stage={stage} />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-bad/30 bg-bad/10 p-3 text-sm text-bad">
            {error}
          </div>
        )}

        {stage === STAGES.DONE ? (

          <div className="mt-8 rounded-2xl border border-good/20 bg-good/5 p-6">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-good text-white">
                ✓
              </div>

              <div>
                <p className="font-semibold text-ink">
                  Documento procesado correctamente
                </p>

                <p className="text-sm text-ink-muted">
                  Ya puedes generar quizzes desde el dashboard.
                </p>
              </div>

            </div>

            <Button
              onClick={() => navigate("/dashboard")}
            >
              Ir al Dashboard →
            </Button>

          </div>

        ) : (

          <div className="mt-8">
            <Button
              onClick={handleUpload}
              disabled={!file}
              className="w-full justify-center"
            >
              Procesar Documento
            </Button>
          </div>

        )}

      </Card>

    </div>

    <div>

      <Card className="p-6">

        <h3 className="mb-4 font-display text-lg font-semibold text-ink">
          ¿Qué obtendrás?
        </h3>

        <div className="space-y-4">

          <div>
            <p className="font-medium text-ink">
              ⚡ Quiz automático
            </p>

            <p className="text-sm text-ink-muted">
              Preguntas generadas por IA.
            </p>
          </div>

          <div>
            <p className="font-medium text-ink">
              📚 Resumen de temas
            </p>

            <p className="text-sm text-ink-muted">
              Identificación de conceptos clave.
            </p>
          </div>

          <div>
            <p className="font-medium text-ink">
              📈 Seguimiento
            </p>

            <p className="text-sm text-ink-muted">
              Historial y métricas de aprendizaje.
            </p>
          </div>

          <div>
            <p className="font-medium text-ink">
              🤖 IA Groq
            </p>

            <p className="text-sm text-ink-muted">
              Generación rápida de evaluaciones.
            </p>
          </div>

        </div>

      </Card>

    </div>

  </div>

</div>
);
}

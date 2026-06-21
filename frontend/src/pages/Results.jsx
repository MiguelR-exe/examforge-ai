import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Map, BookOpen, BarChart3 } from "lucide-react";

import ScoreCard from "../components/result/ScoreCard";
import QuestionReview from "../components/result/QuestionReview";
import ResultTabs from "../components/result/ResultTabs";
import ComingSoonPanel from "../components/result/ComingSoonPanel";
import AnalyticsPanel from "../components/result/AnalyticsPanel";
import Button from "../components/common/Button";

const TABS = [
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "guide", label: "Guía de estudio", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("analytics");

  const result = location.state?.result;
  const questions = location.state?.questions || [];

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="mb-4 font-display text-2xl font-bold text-ink">
          Resultados no encontrados
        </h1>
        <p className="mb-8 text-ink-muted">No hay resultados disponibles para mostrar.</p>
        <Button onClick={() => navigate("/dashboard")}>Volver al Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-muted">Evaluación completada</p>
          <h1 className="font-display text-3xl font-bold text-ink">Resultados del Quiz</h1>
        </div>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <ScoreCard
          score={result.score}
          correctCount={result.correctCount}
          totalQuestions={result.totalQuestions}
        />
      </div>

      <ResultTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "roadmap" && (
        <ComingSoonPanel
          icon={Map}
          title="Tu roadmap de estudio está en camino"
          description="Estamos construyendo un plan de estudio por fases, basado en los temas que más te cuesta dominar a lo largo de tus quizzes."
          requirement="Requiere histórico de varios quizzes por tema"
        />
      )}

      {tab === "guide" && (
        <ComingSoonPanel
          icon={BookOpen}
          title="La guía de estudio todavía no está disponible"
          description="Próximamente generaremos un resumen narrado de los conceptos clave de tu documento, con términos y definiciones extraídas por IA."
          requirement="Requiere generación de contenido adicional desde el documento"
        />
      )}

      {tab === "analytics" && <AnalyticsPanel result={result} questions={questions} />}

      <div className="mt-8 mb-2">
        <QuestionReview detail={result.detail} questions={questions} />
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </Button>
        <Button onClick={() => navigate("/upload")}>Nuevo Documento</Button>
      </div>
    </div>
  );
}
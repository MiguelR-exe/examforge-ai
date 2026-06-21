import { useLocation, useNavigate } from "react-router-dom";

import ResultSummary from "../components/result/ResultSummary";
import Button from "../components/common/Button";

export default function Results() {
const navigate = useNavigate();
const location = useLocation();

const result = location.state?.result;
const questions = location.state?.questions || [];

if (!result) {
return ( <div className="mx-auto max-w-3xl py-20 text-center"> <h1 className="mb-4 font-display text-2xl font-bold text-ink">
Resultados no encontrados </h1>

    <p className="mb-8 text-ink-muted">
      No hay resultados disponibles para mostrar.
    </p>

    <Button onClick={() => navigate("/dashboard")}>
      Volver al Dashboard
    </Button>
  </div>
);

}

return ( <div className="mx-auto max-w-5xl">

  <div className="mb-8 flex items-center justify-between">

    <div>
      <p className="text-sm text-ink-muted">
        Evaluación completada
      </p>

      <h1 className="font-display text-3xl font-bold text-ink">
        Resultados del Quiz
      </h1>
    </div>

    <Button
      variant="ghost"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </Button>

  </div>

  <ResultSummary
    result={result}
    questions={questions}
  />

  <div className="mt-8 flex justify-center gap-4">

    <Button
      variant="ghost"
      onClick={() => navigate("/dashboard")}
    >
      Volver al Dashboard
    </Button>

    <Button
      onClick={() => navigate("/upload")}
    >
      Nuevo Documento
    </Button>

  </div>

</div>

);
}

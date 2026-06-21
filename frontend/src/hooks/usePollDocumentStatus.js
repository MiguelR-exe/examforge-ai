import { useState, useRef, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 90000; // 90s — el análisis normal toma unos segundos (~3-5s),
// pasado este umbral avisamos que está tardando más de lo esperado, sin bloquear.

/**
 * El backend procesa el documento de forma asíncrona
 * (S3 -> EventBridge -> SQS -> Lambda -> Groq -> DynamoDB), así que subir
 * el archivo a S3 no significa que ya esté analizado. Este hook hace
 * polling a GET /dashboard/{userId} buscando, por bucketKey (= nombre de
 * archivo), la entrada correspondiente hasta que su status sea "ANALYZED".
 *
 * No existe un endpoint GET /documents/{id} individual, por eso se reutiliza
 * el dashboard completo — es el único lugar donde el backend expone status.
 */
export function usePollDocumentStatus() {
  const [status, setStatus] = useState("idle"); // idle | polling | found | timeout | error
  const [document, setDocument] = useState(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  }, []);

  const start = useCallback(
    (userId, bucketKey) => {
      stop();
      setStatus("polling");
      setDocument(null);

      const checkOnce = async () => {
        try {
          const data = await dashboardService.getDashboard(userId);
          const match = (data.documents || []).find((d) => d.bucketKey === bucketKey);
          if (match && match.status === "ANALYZED") {
            stop();
            setDocument(match);
            setStatus("found");
          }
        } catch {
          // Un fallo de red puntual no debe detener el polling; seguimos
          // intentando hasta el timeout.
        }
      };

      checkOnce();
      intervalRef.current = setInterval(checkOnce, POLL_INTERVAL_MS);
      timeoutRef.current = setTimeout(() => {
        stop();
        setStatus((current) => (current === "found" ? current : "timeout"));
      }, TIMEOUT_MS);
    },
    [stop]
  );

  const reset = useCallback(() => {
    stop();
    setStatus("idle");
    setDocument(null);
  }, [stop]);

  return { status, document, start, stop, reset };
}

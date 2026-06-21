import { useState, useCallback } from "react";
import { documentService } from "../services/documentService";

const STAGES = {
  IDLE: "idle",
  REQUESTING_URL: "requesting-url",
  UPLOADING: "uploading",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

export function useUpload(userId) {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [error, setError] = useState(null);

  const upload = useCallback(
    async (file) => {
      setError(null);
      try {
        await documentService.uploadDocument({
          file,
          userId,
          onProgress: (s) => setStage(s),
        });
        setStage(STAGES.DONE);
      } catch (err) {
        setError(err.message);
        setStage(STAGES.ERROR);
        throw err;
      }
    },
    [userId]
  );

  const reset = useCallback(() => {
    setStage(STAGES.IDLE);
    setError(null);
  }, []);

  return { stage, error, upload, reset, STAGES };
}
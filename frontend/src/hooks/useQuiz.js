import { useState, useCallback } from "react";
import { quizService } from "../services/quizService";

export function useQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async ({ documentId, numQuestions, difficulty }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.generateQuiz({ documentId, numQuestions, difficulty });
      setQuiz(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const load = useCallback(async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getQuiz(quizId);
      setQuiz(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submit = useCallback(async ({ quizId, userId, answers }) => {
    setLoading(true);
    setError(null);
    try {
      return await quizService.submitQuiz({ quizId, userId, answers });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { quiz, loading, error, generate, load, submit };
}
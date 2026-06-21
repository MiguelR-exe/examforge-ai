import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useQuiz } from "../hooks/useQuiz";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import QuizProgress from "../components/quiz/QuizProgress";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizNavigation from "../components/quiz/QuizNavigation";

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { quiz, loading, error, load, submit } = useQuiz();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (quizId) {
      load(quizId);
    }
  }, [quizId]);

  const questions = quiz?.questions || [];
  const current = questions[currentQuestion];

  const handleSelect = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [current.questionId]: answer,
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    try {
      setSubmitting(true);
      const result = await submit({
        quizId,
        userId: user?.email,
        answers,
      });

      navigate(`/results/${quizId}`, {
        state: { result, questions },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !quiz) {
    return <Loader label="Cargando quiz..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => load(quizId)} />;
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-ink">No se encontró el quiz</h2>
      </div>
    );
  }

  const selectedAnswer = answers[current.questionId];
  const isLast = currentQuestion === questions.length - 1;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 text-sm text-ink-muted">
          Pregunta {currentQuestion + 1} de {questions.length}
        </p>
        <QuizProgress current={currentQuestion} total={questions.length} />
      </div>

      {/*
        El backend (QuizHandler.get_quiz) nunca incluye correctAnswer ni
        explanation en /quizzes/{id} — solo llegan por pregunta en la
        respuesta de /quizzes/{id}/submit, al final del quiz. Por eso aquí
        revealed siempre es false: no hay forma de mostrar "correcto/incorrecto"
        pregunta por pregunta sin un endpoint nuevo de submit parcial.
        El feedback completo se muestra en /results tras enviar el quiz.
      */}
      <QuestionCard
        question={current}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelect}
        revealed={false}
      />

      <div className="mt-8">
        <QuizNavigation
          onNext={handleNext}
          disabled={!selectedAnswer || submitting}
          isLast={isLast}
          loading={submitting}
        />
      </div>
    </div>
  );
}
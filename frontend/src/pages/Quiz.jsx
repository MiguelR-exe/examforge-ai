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

const {
quiz,
loading,
error,
load,
submit,
} = useQuiz();

const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState({});

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
  const result = await submit({
    quizId,
    userId: user?.email,
    answers,
  });

  navigate(`/results/${quizId}`, {
    state: {
      result,
      questions,
    },
  });
} catch (err) {
  console.error(err);
}


};

if (loading && !quiz) {
return <Loader label="Cargando quiz..." />;
}

if (error) {
return (
<ErrorMessage
message={error}
onRetry={() => load(quizId)}
/>
);
}

if (!quiz || questions.length === 0) {
return ( <div className="py-20 text-center"> <h2 className="text-xl font-semibold text-ink">
No se encontró el quiz </h2> </div>
);
}

const selectedAnswer =
answers[current.questionId];

return ( <div className="mx-auto max-w-4xl">

```
  <div className="mb-8">

    <p className="mb-2 text-sm text-ink-muted">
      Pregunta {currentQuestion + 1} de {questions.length}
    </p>

    <QuizProgress
      current={currentQuestion}
      total={questions.length}
    />

  </div>

  <QuestionCard
    question={current}
    selectedAnswer={selectedAnswer}
    onSelect={handleSelect}
    revealed={false}
  />

  <div className="mt-8">

    <QuizNavigation
      onNext={handleNext}
      disabled={!selectedAnswer}
      isLast={
        currentQuestion === questions.length - 1
      }
    />

  </div>

</div>
);
}

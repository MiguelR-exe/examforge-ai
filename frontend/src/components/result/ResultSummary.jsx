import ScoreCard from "./ScoreCard";
import QuestionReview from "./QuestionReview";

export default function ResultSummary({ result, questions }) {
  return (
    <div className="space-y-6">
      <ScoreCard
        score={result.score}
        correctCount={result.correctCount}
        totalQuestions={result.totalQuestions}
      />
      <QuestionReview detail={result.detail} questions={questions} />
    </div>
  );
}

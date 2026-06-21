import { FileText, Zap, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardStats({ data }) {
  const totalDocuments = data?.totalDocumentsUploaded ?? 0;
  const totalQuizzes = data?.totalQuizzes ?? 0;
  const averageScore = data?.averageScore ?? 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="Documentos procesados" value={totalDocuments} icon={FileText} />
      <StatCard label="Quizzes completados" value={totalQuizzes} icon={Zap} />
      <StatCard label="Promedio general" value={`${averageScore}%`} icon={TrendingUp} />
    </div>
  );
}

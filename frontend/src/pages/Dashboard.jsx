import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import QuizHistory from "../components/dashboard/QuizHistory";
import UploadPanel from "../components/upload/UploadPanel";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useDashboard(user?.email);

  // Cuando se genera un quiz desde el panel de upload, navegamos directo
  // y además refrescamos el dashboard en segundo plano (el nuevo documento
  // ya debería aparecer en RecentDocuments la próxima vez que se visite).
  const handleQuizGenerated = (quizId) => {
    refresh();
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div>
      <DashboardHeader />

      {loading && <Loader label="Cargando tu progreso..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={refresh} />}

      {!loading && !error && data && (
        <>
          <DashboardStats data={data} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <UploadPanel onQuizGenerated={handleQuizGenerated} />
            </div>
            <div className="lg:col-span-2">
              <RecentDocuments documents={data.documents} />
            </div>
          </div>

          <div className="mt-6">
            <QuizHistory history={data.history} />
          </div>
        </>
      )}
    </div>
  );
}
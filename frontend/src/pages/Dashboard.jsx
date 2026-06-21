import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import QuizHistory from "../components/dashboard/QuizHistory";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, refresh } = useDashboard(user?.email);

  return (
    <div>
      <div className="mb-2 flex items-start justify-between">
        <DashboardHeader />
        <Link to="/upload">
          <Button>+ Subir documento</Button>
        </Link>
      </div>

      {loading && <Loader label="Cargando tu progreso..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={refresh} />}

      {!loading && !error && data && (
        <>
          <DashboardStats data={data} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentDocuments documents={data.documents} />
            <QuizHistory history={data.history} />
          </div>
        </>
      )}
    </div>
    
  );
}
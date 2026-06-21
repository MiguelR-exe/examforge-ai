import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";

export function useDashboard(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await dashboardService.getDashboard(userId);

      console.log("DASHBOARD RESPONSE", response);

      setData(response);
    } catch (err) {
      console.error(err);
      setError("Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      load();
    }
  }, [userId]);

  return {
    data,
    loading,
    error,
    refresh: load,
  };
}
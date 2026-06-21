import { useEffect, useState, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";

export function useDashboard(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await dashboardService.getDashboard(userId);
      setData(response);
    } catch (err) {
      console.error(err);
      setError("Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      load();
    }
  }, [userId, load]);

  return {
    data,
    loading,
    error,
    refresh: load,
  };
}
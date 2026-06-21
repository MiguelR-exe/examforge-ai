import { api } from "./api";

export const dashboardService = {
  getDashboard: (email) =>
    api.request(`/dashboard/${email}`),
};
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TOKEN_KEY = "examforge_token";
export const USER_KEY = "examforge_user";

export const DIFFICULTY_OPTIONS = [
  { value: "facil", label: "Fácil" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

export const QUESTION_COUNT_OPTIONS = [5, 10, 20];

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  UPLOAD: "/upload",
  QUIZ: "/quiz/:quizId",
  RESULTS: "/results/:quizId",
  PROFILE: "/profile",
};
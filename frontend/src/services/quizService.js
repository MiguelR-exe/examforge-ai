import { api } from "./api";

export const quizService = {
  generateQuiz: ({ documentId, numQuestions, difficulty }) =>
    api.request("/quizzes/generate", {
      method: "POST",
      body: { documentId, numQuestions, difficulty },
    }),

  getQuiz: (quizId) =>
    api.request(`/quizzes/${quizId}`),

  submitQuiz: ({ quizId, userId, answers }) =>
    api.request(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: { userId, answers },
    }),
};
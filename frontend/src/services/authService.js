import { api } from "./api";

export const authService = {
  register: ({ email, password, name }) =>
    api.request("/auth/register", { method: "POST", body: { email, password, name } }),

  login: ({ email, password }) =>
    api.request("/auth/login", { method: "POST", body: { email, password } }),
};

import api from "./index";

export const login = (name: string, email: string, password: string) =>
    api.post("/auth/login", { name, email, password }).then((res) => res.data);

export const register = (name: string, email: string, password: string) =>
    api
        .post("/auth/register", { name, email, password })
        .then((res) => res.data);

export const logout = () => api.post("/auth/logout").then((res) => res.data);

export const refresh = () => api.post("/auth/refresh").then((res) => res.data);

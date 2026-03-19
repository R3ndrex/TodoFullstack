import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "../lib/auth.ts";
import axios from "axios";
import { setAccessToken } from "../lib/index";
type User = { id: number; name: string; email: string } | null;

interface AuthContextType {
    user: User;
    login: (name: string, email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await axios.post(
                    "http://localhost:3000/api/auth/refresh",
                    {},
                    { withCredentials: true },
                );
                setAccessToken(data.accessToken);
                setUser(data);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (name: string, email: string, password: string) => {
        const data = await authApi.login(name, email, password);
        setUser(data);
    };

    const register = async (name: string, email: string, password: string) => {
        const data = await authApi.register(name, email, password);
        setUser(data);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}

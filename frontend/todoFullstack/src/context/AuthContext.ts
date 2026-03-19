import { createContext } from "react";

export type User = { id: number; name: string; email: string } | null;

export interface AuthContextType {
    user: User;
    login: (name: string, email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AuthPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    const mutation = useMutation({
        mutationFn: () =>
            isRegister
                ? register(name, email, password)
                : login(name, email, password),
        onSuccess: () => navigate("/"),
    });

    return (
        <div className="auth-page">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate();
                }}
            >
                <h2>{isRegister ? "Register" : "Login"}</h2>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {mutation.isError && (
                    <div className="error">
                        {mutation.error?.response?.data?.message ||
                            "Something went wrong"}
                    </div>
                )}
                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending
                        ? "Please wait…"
                        : isRegister
                          ? "Register"
                          : "Login"}
                </button>
            </form>
            <button
                onClick={() => {
                    setIsRegister(!isRegister);
                    mutation.reset();
                }}
            >
                {isRegister ? "Already have an account?" : "Create account"}
            </button>
        </div>
    );
}

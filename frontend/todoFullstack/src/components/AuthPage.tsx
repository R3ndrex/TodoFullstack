import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const { user, isLoading } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoading && user) {
            navigate("/", { replace: true });
        }
    }, [user, isLoading, navigate]);

    if (isLoading) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isRegister) {
                await register(name, email, password);
            } else {
                await login(name, email, password);
            }
            navigate("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Something went wrong",
            );
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
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
                <button type="submit">
                    {isRegister ? "Register" : "Login"}
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Already have an account?" : "Create account"}
            </button>
        </div>
    );
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos } from "../lib/todos";
import TodoItem from "../components/TodoItem";
import CreateTodoModal from "../components/CreateTodoModal";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TodosPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const { data: todos } = useQuery({
        queryKey: ["todos"],
        queryFn: () => getTodos(),
    });

    const handleLogout = async () => {
        await logout();
        queryClient.clear();
        navigate("/auth");
    };

    return (
        <div className="todos-page">
            <h1>Your Todos</h1>
            <div>
                <button onClick={() => setShowModal(true)}>New Todo</button>
                <button onClick={handleLogout}>LogOut</button>
            </div>
            {todos?.map((todo) => (
                <TodoItem
                    key={todo.id}
                    {...todo}
                    onUpdate={() =>
                        queryClient.invalidateQueries({ queryKey: ["todos"] })
                    }
                />
            ))}
            {showModal && (
                <CreateTodoModal onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}

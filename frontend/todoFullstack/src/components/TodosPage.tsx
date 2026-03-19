import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos } from "../lib/todos";
import TodoItem from "../components/TodoItem";
import CreateTodoModal from "../components/CreateTodoModal";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

type Filter = "all" | "active" | "done";

export default function TodosPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<Filter>("all");
    const { logout } = useAuth();
    const navigate = useNavigate();

    const doneParam =
        filter === "all" ? undefined : filter === "done" ? true : false;

    const { data: todos } = useQuery({
        queryKey: ["todos", filter],
        queryFn: () => getTodos(doneParam),
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

            <div className="filters">
                {(["all", "active", "done"] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={filter === f ? "active" : ""}
                    >
                        {f === "all"
                            ? "All"
                            : f === "active"
                              ? "Active"
                              : "Done"}
                    </button>
                ))}
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

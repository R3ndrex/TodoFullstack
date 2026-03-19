import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos } from "../lib/todos";
import TodoItem from "../components/TodoItem";
import CreateTodoModal from "../components/CreateTodoModal";
import { useState } from "react";

export default function TodosPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);

    const { data: todos, refetch } = useQuery({
        queryKey: ["todos"],
        queryFn: () => getTodos(),
    });

    return (
        <div className="todos-page">
            <button onClick={() => setShowModal(true)}>New Todo</button>
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

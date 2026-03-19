import { useState } from "react";
import { createTodo } from "../lib/todos";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateTodoModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await createTodo({ title, content });
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        onClose();
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <h2>Create Todo</h2>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="button-container">
                    <button type="submit">Create</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

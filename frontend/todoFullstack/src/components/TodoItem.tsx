import { useState } from "react";
import { updateTodo, deleteTodo } from "../lib/todos";

interface TodoCardProps {
    id: number;
    title: string;
    content?: string;
    done: boolean;
    onUpdate: () => void;
}

export default function TodoItem({
    id,
    title,
    content,
    done,
    onUpdate,
}: TodoCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    const handleToggle = async () => {
        await updateTodo({ id, done: !done });
        onUpdate();
    };

    const handleSave = async () => {
        await updateTodo({ id, title: newTitle });
        setIsEditing(false);
        onUpdate();
    };

    const handleDelete = async () => {
        await deleteTodo(id);
        onUpdate();
    };

    return (
        <div className={`todo-card ${done ? "done" : ""}`}>
            {isEditing ? (
                <>
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    <h3>{title}</h3>
                    <p>{content}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={handleToggle}>
                        {done ? "Undo" : "Done"}
                    </button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    );
}

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
    const [newContent, setNewContent] = useState(content ?? "");
    const handleToggle = async () => {
        await updateTodo({ id, done: !done });
        onUpdate();
    };

    const handleDelete = async () => {
        await deleteTodo(id);
        onUpdate();
    };

    const handleSave = async () => {
        await updateTodo({ id, title: newTitle, content: newContent });
        setIsEditing(false);
        onUpdate();
    };

    return (
        <div
            className={`todo-card ${done ? "done" : ""} ${isEditing ? "edit" : ""}`}
        >
            {isEditing ? (
                <>
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    <div className="button-container">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
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

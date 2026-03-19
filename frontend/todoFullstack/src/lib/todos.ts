import api from "./index";

export type TodoStatus = "todo" | "in_progress" | "done";

export interface Todo {
    id: number;
    title: string;
    content?: string;
    done: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTodoInput {
    title: string;
    content?: string;
}

export interface UpdateTodoInput {
    id: number;
    title?: string;
    content?: string;
    done?: boolean;
}

export async function getTodos(done?: boolean): Promise<Todo[]> {
    const params: Record<string, string> = {};
    if (done !== undefined) params.done = String(done);
    const { data } = await api.get<Todo[]>("/todos", { params });
    return data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
    const { data } = await api.post<Todo>("/todos", input);
    return data;
}

export async function updateTodo(input: UpdateTodoInput): Promise<Todo> {
    const { data } = await api.put<Todo>("/todos", input);
    return data;
}

export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete("/todos", { data: { id } });
};

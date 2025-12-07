import { useState, useCallback, memo } from "react";

interface Todo {
    id: number;
    title: string;
}

interface TodoItemProps {
    todo: Todo;
    onEdit: (id: number) => void;
}

const TodoItem = memo(function TodoItem({ todo, onEdit }: TodoItemProps) {
    return (
        <div className="flex items-center justify-between p-3 border rounded">
            <span>{todo.title}</span>
            <button
                onClick={() => onEdit(todo.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit
            </button>
        </div>
    );
});

interface TodoListProps {
    todos: Todo[];
    onEdit: (id: number) => void;
}

function TodoList({ todos, onEdit }: TodoListProps) {
    return (
        <div className="space-y-2">
            {todos.map((t) => (
                <TodoItem key={t.id} todo={t} onEdit={onEdit} />
            ))}
        </div>
    );
}

export default function OptimizedList() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, title: "Buy milk" },
        { id: 2, title: "Write code" },
    ]);

    const handleEdit = useCallback((id: number) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, title: t.title + " ✔" } : t))
        );
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Optimized Todo List</h2>
            <TodoList todos={todos} onEdit={handleEdit} />
        </div>
    );
}

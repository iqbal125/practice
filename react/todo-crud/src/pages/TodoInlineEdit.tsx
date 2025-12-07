import { useState, useCallback, memo } from "react";

interface Todo {
    id: number;
    title: string;
}

interface TodoItemProps {
    todo: Todo;
    onEdit: (id: number, title: string) => void;
    onDelete: (id: number) => void;
}

const TodoItem = memo(function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(todo.title);

    const handleBlur = () => {
        onEdit(todo.id, text);
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleBlur();
        } else if (e.key === "Escape") {
            setText(todo.title);
            setEditing(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-3 border rounded">
            {editing ? (
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 p-1 border rounded"
                />
            ) : (
                <span
                    onClick={() => setEditing(true)}
                    className="flex-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                >
                    {todo.title}
                </span>
            )}
            <button
                onClick={() => onDelete(todo.id)}
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
                X
            </button>
        </div>
    );
});

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState("");

    const addTodo = () => {
        if (!inputValue.trim()) return;
        setTodos((prev) => [...prev, { id: Date.now(), title: inputValue }]);
        setInputValue("");
    };

    const editTodo = useCallback((id: number, title: string) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
    }, []);

    const deleteTodo = useCallback((id: number) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTodo();
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Todo App</h2>
            <div className="flex gap-2 mb-4">
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a new todo..."
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={addTodo}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            <div className="space-y-2">
                {todos.map((t) => (
                    <TodoItem key={t.id} todo={t} onEdit={editTodo} onDelete={deleteTodo} />
                ))}
            </div>
        </div>
    );
}

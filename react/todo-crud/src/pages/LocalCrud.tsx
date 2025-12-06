import React, { useState } from 'react';

const todosEx = [
    { id: 1, title: "title1", description: "description1" },
    { id: 2, title: "title2", description: "description2" },
    { id: 3, title: "title3", description: "description3" },
]

const LocalCrud: React.FC = () => {
    const [todos, setTodos] = useState(todosEx)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [titleEdit, setTitleEdit] = useState('')
    const [descriptionEdit, setDescriptionEdit] = useState('')
    const [updateTodoId, setUpdateTodoId] = useState(0)

    const addTodo = () => {
        const todo = {
            id: Math.floor(Math.random() * 100),
            title,
            description
        }

        setTodos(prev => [...prev, todo])
        setTitle('')
        setDescription('')
    }

    const setUpdateTodo = (title: string, description: string, id: number) => {
        setTitleEdit(title)
        setDescriptionEdit(description)
        setUpdateTodoId(id)
    }

    const updateTodo = () => {
        const updatedTodo = {
            id: updateTodoId,
            title: titleEdit,
            description: descriptionEdit
        }

        const tempArr = todos.map(todo => {
            return todo.id === updateTodoId ? updatedTodo : todo
        })

        setTodos(tempArr)
    }

    const deleteTodo = (id: number) => {
        const tempArr = todos.filter(todo => todo.id !== id)
        setTodos(tempArr)
    }


    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Local CRUD</h1>
            <p className="text-gray-600">Todo CRUD with local state management</p>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter todo title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Enter todo description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>
                <button
                    onClick={() => addTodo()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Add Todo
                </button>
            </div>
            <div>
                <h3>Editing Todos</h3>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={titleEdit}
                            onChange={e => setTitleEdit(e.target.value)}
                            placeholder="Enter todo title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={descriptionEdit}
                            onChange={e => setDescriptionEdit(e.target.value)}
                            placeholder="Enter todo description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                    <button
                        onClick={() => updateTodo()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Update Todo
                    </button>
                </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">List TODOS</h2>
            <div className="space-y-3">
                {todos.map(todo => (
                    <div key={todo.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                        <div className="font-medium text-gray-900">{todo.title}</div>
                        <div className="text-gray-600 text-sm mt-1">{todo.description}</div>
                        <button onClick={() => setUpdateTodo(todo.title, todo.description, todo.id)}>Update Todo</button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete Todo</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocalCrud;

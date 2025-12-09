/**
 * ⭐ Task Manager with Filtering & Statistics
 * 
 * Interview Prompt:
 * Build a task management app where users can:
 * - Add new tasks with title and priority (low/medium/high)
 * - Mark tasks as complete/incomplete
 * - Filter tasks by status (all/active/completed)
 * - Delete tasks
 * - See statistics: total tasks, completed, and active count
 * 
 * Core Requirements:
 * - Controlled form inputs
 * - Task list with inline actions (complete, delete)
 * - Filter buttons to toggle view
 * - Footer showing task statistics
 * - Proper state management
 * 
 * Stretch Goals:
 * - Edit task inline
 * - Priority-based color coding
 * - Sort by priority or date created
 * - Persist to localStorage
 * - Bulk actions (complete all, delete completed)
 */

import { useState } from "react";


// task form, add task, 2 input fields, need to pass down tasks state and setState
// controlled component for input elements
// add button, when clicked save state, clear controlled component state

interface TaskFormsPropsI {
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

interface FilterBarPropsI {
    filters: priority[]
    setFilters: React.Dispatch<React.SetStateAction<priority[]>>
}

type priority = 'low' | 'medium' | "high"

const TaskForm = ({ setTasks }: TaskFormsPropsI) => {
    const [title, setTitle] = useState('')
    const [priority, setPriority] = useState<priority>('low')

    const handleSubmit = () => {
        //need setTasks 
        const task = {
            title,
            priority
        }
        setTasks(prev => [...prev, task])
        setTitle('')
        setPriority("low")
    }

    return (<div>
        <input id="title" onChange={e => setTitle(e.target.value)} value={title} />
        <select name="priority" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
        </select>
        <button onClick={() => handleSubmit()}>Submit</button>
    </div>)

}


//add filters array
//use filters to filter the array


const FilterBar = ({ filters, setFilters }: FilterBarPropsI) => {
    const handleAddFilter = (priority: priority) => {
        if (filters.includes(priority)) {
            setFilters(filters.filter(filterType => filterType !== priority))
        } else {
            setFilters([...filters, priority])
        }
    }

    return (
        <div>
            <div onClick={() => handleAddFilter('low')} style={{ color: filters.includes("low") ? "red" : "black" }} >Low</div>
            <div onClick={() => handleAddFilter('medium')} style={{ color: filters.includes("medium") ? "red" : "black" }}>Medium</div>
            <div onClick={() => handleAddFilter('high')} style={{ color: filters.includes("high") ? "red" : "black" }}>High</div>
        </div>
    )
}

interface Task {
    title: string
    priority: priority
}

export default function TaskApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filters, setFilters] = useState<priority[]>([]);

    // Filter tasks based on selected priorities
    const filteredTasks = filters.length === 0
        ? tasks
        : tasks.filter(task => filters.includes(task.priority));

    return (
        <div>
            <FilterBar filters={filters} setFilters={setFilters} />
            <h1>Tasks</h1>
            <div>
                {filteredTasks.map((task, index) => <div key={index}>{task.priority} - {task.title}</div>)}
            </div>
            <TaskForm setTasks={setTasks} />
            {/* TODO: TaskFilters */}

            {/* TODO: TaskList */}
            {/* TODO: Footer with counts */}
        </div>
    );
}


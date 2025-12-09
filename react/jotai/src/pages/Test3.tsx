import { atom, useAtom, useSetAtom, useAtomValue } from "jotai";

// atoms.ts
export const tasksAtom = atom(async () => {
    // ❌ Bug: async atom has no dependencies, never re-runs on updates
    const res = await fetch("/api/tasks");
    return res.json();
});

export const toggleTaskAtom = atom(
    null,
    (get, set, id: number) => {
        const tasks = get(tasksAtom);
        const newTasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );

        // ❌ Bug: directly mutating async atom output, tasksAtom is read-only
        set(tasksAtom, newTasks);
    }
);

export const statsAtom = atom((get) => {
    const tasks = get(tasksAtom);

    // ❌ Bug: tasks may be a Promise if async atom is still loading
    const completed = tasks.filter(t => t.completed).length;
    return {
        total: tasks.length,
        completed,
        pending: tasks.length - completed,
    };
});

export default function TaskList() {
    const [tasks] = useAtom(tasksAtom); // ❌ Suspense not wrapped

    return (
        <div>
            {tasks.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
    );
}


export function TaskItem({ task }) {
    const toggle = useSetAtom(toggleTaskAtom);

    return (
        <div onClick={() => toggle(task.id)}>
            <input type="checkbox" checked={task.completed} readOnly />
            {task.title}
        </div>
    );
}


export function StatsBar() {
    const stats = useAtomValue(statsAtom); // ❌ will error during Promise state

    return (
        <div>
            {stats.completed}/{stats.total} done
        </div>
    );
}


export function DebugPanel() {
    const [tasks] = useAtom(tasksAtom);
    return <pre>{JSON.stringify(tasks, null, 2)}</pre>;
}

import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import { Provider, atom, useAtom, useSetAtom } from 'jotai'
import type { PrimitiveAtom } from 'jotai'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Todo = {
    title: string
    completed: boolean
}

const filterAtom = atom('all')
const todosAtom = atom<PrimitiveAtom<Todo>[]>([])
const filteredAtom = atom<PrimitiveAtom<Todo>[]>((get) => {
    const filter = get(filterAtom)
    const todos = get(todosAtom)
    if (filter === 'all') return todos
    else if (filter === 'completed')
        return todos.filter((atom) => get(atom).completed)
    else return todos.filter((atom) => !get(atom).completed)
})

type RemoveFn = (item: PrimitiveAtom<Todo>) => void
type TodoItemProps = {
    atom: PrimitiveAtom<Todo>
    remove: RemoveFn
}
const TodoItem = ({ atom, remove }: TodoItemProps) => {
    const [item, setItem] = useAtom(atom)
    const toggleCompleted = () => setItem((props) => ({ ...props, completed: !props.completed }))

    return (
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
            <Checkbox
                checked={item.completed}
                onCheckedChange={toggleCompleted}
            />
            <span className={item.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                {item.title}
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(atom)}
                className="h-8 w-8"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}

const Filter = () => {
    const [filter, set] = useAtom(filterAtom)
    return (
        <RadioGroup
            value={filter}
            onValueChange={set}
            className="flex flex-row gap-4"
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed">Completed</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="incompleted" id="incompleted" />
                <Label htmlFor="incompleted">Incompleted</Label>
            </div>
        </RadioGroup>
    )
}

type FilteredType = {
    remove: RemoveFn
}
const Filtered = (props: FilteredType) => {
    const [todos] = useAtom(filteredAtom)
    return (
        <div className="space-y-2 mt-4">
            {todos.map((atom) => (
                <div
                    key={atom.toString()}
                    className="animate-in fade-in slide-in-from-left-2 duration-300"
                >
                    <TodoItem atom={atom} {...props} />
                </div>
            ))}
        </div>
    )
}

const TodoList = () => {
    const setTodos = useSetAtom(todosAtom)
    const remove: RemoveFn = (todo) =>
        setTodos((prev) => prev.filter((item) => item !== todo))
    const add = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const title = e.currentTarget.inputTitle.value
        e.currentTarget.inputTitle.value = ''
        setTodos((prev) => [...prev, atom<Todo>({ title, completed: false })])
    }
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <form onSubmit={add} className="space-y-4">
                <Filter />
                <div className="flex gap-2">
                    <Input
                        name="inputTitle"
                        placeholder="Add a new todo..."
                        className="flex-1"
                    />
                    <Button type="submit">Add</Button>
                </div>
            </form>
            <Filtered remove={remove} />
        </div>
    )
}

export default function TodoPage() {
    return (
        <Provider>
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Jōtai Todo App</h1>
                    <TodoList />
                </div>
            </div>
        </Provider>
    )
}

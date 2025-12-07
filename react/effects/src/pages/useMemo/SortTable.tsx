import { useState, useMemo } from "react";

interface User {
    id: number;
    name: string;
    role: "admin" | "user";
}

interface DataTableProps {
    users: User[];
}

export default function DataTable({ users }: DataTableProps) {
    const [role, setRole] = useState<"all" | "admin" | "user">("all");
    const [sortAsc, setSortAsc] = useState(true);

    const filtered = useMemo(() => {
        let res = [...users];
        if (role !== "all") {
            res = res.filter((u) => u.role === role);
        }
        res.sort((a, b) =>
            sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
        return res;
    }, [users, role, sortAsc]);

    const handleReset = () => {
        setRole("all");
        setSortAsc(true);
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex gap-2">
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "all" | "admin" | "user")}
                    className="p-2 border rounded"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>

                <button
                    onClick={() => setSortAsc((s) => !s)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Sort {sortAsc ? "↓" : "↑"}
                </button>

                <button
                    onClick={handleReset}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-2">
                {filtered.map((u) => (
                    <div key={u.id} className="p-3 border rounded">
                        <span className="font-semibold">{u.name}</span> —{" "}
                        <span className="text-gray-600">{u.role}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from "react";

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const cache: Record<string, User[]> = {};

export default function AutoComplete() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        if (cache[query]) {
            setResults(cache[query]);
            return;
        }

        setLoading(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            fetch(`https://dummyjson.com/users/search?q=${query}`)
                .then((res) => res.json())
                .then((data) => {
                    cache[query] = data.users;
                    setResults(data.users);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, 300);
    }, [query]);

    return (
        <div className="p-4">
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users…"
                className="w-full p-2 border rounded"
            />
            {loading && <div className="mt-2">Loading…</div>}
            <div className="mt-4 space-y-2">
                {results.map((u) => (
                    <div key={u.id} className="p-2 border rounded">
                        {u.firstName} {u.lastName}
                    </div>
                ))}
            </div>
        </div>
    );
}

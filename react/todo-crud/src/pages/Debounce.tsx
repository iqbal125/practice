import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}

export default function SearchBox() {
    const [query, setQuery] = useState("");
    const debounced = useDebounce(query, 300);

    useEffect(() => {
        if (!debounced) return;
        console.log("API call:", debounced);
    }, [debounced]);

    return (
        <div className="p-4">
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full p-2 border rounded"
            />
        </div>
    );
}

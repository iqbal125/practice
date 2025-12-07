import { useMemo, useState } from "react";

function FilterableList() {
    const [query, setQuery] = useState("");
    const items = ["apple", "banana", "orange", "pear"];

    const filtered = useMemo(() => {
        return items.filter(i => i.toLowerCase().includes(query.toLowerCase()));
    }, [query]);

    return (
        <div>
            <input value={query} onChange={e => setQuery(e.target.value)} />
            {filtered.map(i => <div key={i}>{i}</div>)}
        </div>
    );
}

import { atom, useAtom, useSetAtom } from "jotai";

// Read-write atom
const countAtom = atom(0);

// Read-write atom (custom read and write)
const count = atom(1);
export const readWriteAtom = atom(
    (get) => get(count),
    (get, set) => {
        set(count, get(count) + 1);
    }
);

// Write-only atom that increments the count
const incrementAtom = atom(
    null, // write-only atoms have null as the read function
    (get, set) => {
        set(countAtom, get(countAtom) + 1);
    }
);

// Write-only atom that decrements the count
const decrementAtom = atom(
    null,
    (get, set) => {
        set(countAtom, get(countAtom) - 1);
    }
);

// Write-only atom that resets the count
const resetAtom = atom(
    null,
    (get, set) => {
        set(countAtom, 0);
    }
);

const WriteOnly = () => {
    const [countValue] = useAtom(countAtom);
    const [readWriteValue, incrementReadWrite] = useAtom(readWriteAtom);
    const increment = useSetAtom(incrementAtom);
    const decrement = useSetAtom(decrementAtom);
    const reset = useSetAtom(resetAtom);

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Atoms Demo</h1>
            
            <div style={{ marginBottom: "2rem" }}>
                <h2>Read-Write Atom</h2>
                <p>Count: <strong>{readWriteValue}</strong></p>
                <button onClick={incrementReadWrite}>Increment (Read-Write)</button>
                <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
                    This atom has both read and write functions.
                </p>
            </div>

            <div>
                <h2>Write-Only Atoms</h2>
                <p>Count: <strong>{countValue}</strong></p>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={increment}>Increment</button>
                    <button onClick={decrement}>Decrement</button>
                    <button onClick={reset}>Reset</button>
                </div>
                <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
                    Write-only atoms have <code>null</code> as their read function and are useful for actions/commands.
                </p>
            </div>
        </div>
    );
};

export default WriteOnly;


import { useEffect, useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Effect sees the count:", count);
    }, [count]);

    const increment = () => {
        console.log("Before setCount:", count);
        setCount(count + 1);
        console.log("After setCount:", count);
    };

    return (
        <button onClick={increment}>Count: {count}</button>
    );
}

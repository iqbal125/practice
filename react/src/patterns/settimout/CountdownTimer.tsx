import { useEffect, useState } from "react";

function Countdown({ initialTime = 10 }) {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    return <div>Time left: {timeLeft}</div>;
}
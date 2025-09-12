import { useEffect, useState } from "react";

function PausableTimer() {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setSeconds(0);
        setIsActive(false);
    };

    return (
        <div>
            <div>{seconds}s</div>
            <button onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

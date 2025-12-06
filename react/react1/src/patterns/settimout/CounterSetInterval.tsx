import React, { useEffect, useState } from 'react';

const CounterSetInterval: React.FC = () => {
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(prevCount => prevCount + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    //will still run after component unmounts
    useEffect(() => {
        setTimeout(() => {
            console.log('Timer executed');
        }, 5000);
    }, []);

    return (
        <div>

        </div>
    );
};


export default CounterSetInterval;

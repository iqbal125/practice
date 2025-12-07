import { useState, useEffect, useLayoutEffect } from 'react';

// 🔥 ** Welcome to the React Batching Interview Round **
// These are ** high - level senior React questions ** designed to test deep understanding of:
// * state batching(React 18 vs pre - 18)
// * effects vs render phase
// * stale closures
// * async boundaries
// * event loop timing
// * scheduling behavior

// ---

// # 🚀 ** Q1 — Basic Batching Behavior **
// What does this log? Order of logs? What is printed for A, B, and Effect?
const Q1_BasicBatching = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("A:", count);
        setCount(count + 1);
        setCount(count + 1);
        console.log("B:", count);
    };

    useEffect(() => {
        console.log("Effect:", count);
    }, [count]);

    return <button onClick={handleClick}>Q1: Click Me (count: {count})</button>;
};

// ---

// # 🚀 ** Q2 — Promise / Microtask Boundary **
// What does this log under React 18? Does React batch updates inside the Promise?
const Q2_PromiseBoundary = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("A:", count);
        Promise.resolve().then(() => {
            setCount(count + 1);
            setCount(count + 1);
            console.log("B:", count);
        });
        console.log("C:", count);
    };

    return <button onClick={handleClick}>Q2: Promise Batching (count: {count})</button>;
};

// ---

// # 🚀 ** Q3 — setTimeout Boundary **
// What does this print in React 18? Does batching still happen?
const Q3_SetTimeoutBoundary = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("A:", count);
        setTimeout(() => {
            setCount(count + 1);
            setCount(count + 1);
            console.log("B:", count);
        }, 0);
        console.log("C:", count);
    };

    return <button onClick={handleClick}>Q3: setTimeout Batching (count: {count})</button>;
};

// ---

// # 🚀 ** Q4 — Stale Closure in Batched Updates **
// How many increments actually occur? What is logged? What is the committed state afterward?
const Q4_StaleClosure = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
        console.log(count);
    };

    return <button onClick={handleClick}>Q4: Stale Closure (count: {count})</button>;
};

// ---

// # 🚀 ** Q5 — Functional Updates vs Stale Values **
// What is logged? What is the committed state afterward?
const Q5_FunctionalUpdates = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(c => c + 1);
        setCount(c => c + 1);
        setCount(c => c + 1);
        console.log(count);
    };

    return <button onClick={handleClick}>Q5: Functional Updates (count: {count})</button>;
};

// ---

// # 🚀 ** Q6 — Effect Ordering **
// What prints and why? Explain the sequence.
const Q6_EffectOrdering = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("A:", count);
        setCount(c => c + 1);
        console.log("B:", count);
    };

    useEffect(() => {
        console.log("Effect:", count);
    }, [count]);

    return <button onClick={handleClick}>Q6: Effect Ordering (count: {count})</button>;
};

// ---

// # 🚀 ** Q7 — Why Does This Not Re-render Twice? **
// Explain: Why React batches these, Why only one re-render occurs, How React calculates the final value
const Q7_WhyNoDualRender = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(c => c + 1);
        setCount(c => c + 1);
    };

    return <button onClick={handleClick}>Q7: Dual setState (count: {count})</button>;
};

// ---

// # 🚀 ** Q8 — Async Race Condition With Batching **
// Explain: which count value is used for updates, what logs, why it's wrong, how to fix
const Q8_AsyncRaceCondition = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setTimeout(() => {
            console.log("A:", count);
            setCount(count + 1);
            console.log("B:", count);
            setCount(count + 1);
            console.log("C:", count);
        }, 1000);
    };

    return <button onClick={handleClick}>Q8: Race Condition (count: {count})</button>;
};

// ---

// # 🚀 ** Q9 — Effect vs Layout Effect With Batching **
// When count changes: Which logs first? Why? How does batching affect this ordering?
const Q9_EffectVsLayoutEffect = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("useEffect:", count);
    }, [count]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect:", count);
    }, [count]);

    const handleClick = () => {
        setCount(c => c + 1);
    };

    return <button onClick={handleClick}>Q9: Effect vs Layout (count: {count})</button>;
};

// ---

// # 🚀 ** Q10 — Strict Mode Double Render + Batching **
// What logs, and in what order? Why is setCount allowed inside render?
// Why does the update not loop infinitely? How does batching apply here?
const Q10_StrictModeDoubleRender = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Effect:", count);
    }, [count]);

    console.log("Render:", count);

    // This will only run once during initialization
    if (count === 0) {
        // Using queueMicrotask to avoid infinite loop
        queueMicrotask(() => setCount(1));
    }

    return <div>Q10: Strict Mode (count: {count})</div>;
};

// ---

// Main component with all questions
const BatchingInterviewQuestions = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🔥 React Batching Interview Questions</h1>
            <p>Open the console to see the logs!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                <Q1_BasicBatching />
                <Q2_PromiseBoundary />
                <Q3_SetTimeoutBoundary />
                <Q4_StaleClosure />
                <Q5_FunctionalUpdates />
                <Q6_EffectOrdering />
                <Q7_WhyNoDualRender />
                <Q8_AsyncRaceCondition />
                <Q9_EffectVsLayoutEffect />
                <Q10_StrictModeDoubleRender />
            </div>
        </div>
    );
};

export default BatchingInterviewQuestions;

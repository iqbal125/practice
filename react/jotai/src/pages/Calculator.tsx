import { atom, useAtom } from 'jotai';

// Atoms for calculator state
const displayAtom = atom('0');
const operatorAtom = atom<string | null>(null);
const previousValueAtom = atom<number | null>(null);
const waitingForOperandAtom = atom(false);

export default function Calculator() {
    const [display, setDisplay] = useAtom(displayAtom);
    const [operator, setOperator] = useAtom(operatorAtom);
    const [previousValue, setPreviousValue] = useAtom(previousValueAtom);
    const [waitingForOperand, setWaitingForOperand] = useAtom(waitingForOperandAtom);

    const handleNumber = (num: string) => {
        if (waitingForOperand) {
            setDisplay(num);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const handleOperator = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operator);
            setDisplay(String(newValue));
            setPreviousValue(newValue);
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (firstValue: number, secondValue: number, op: string): number => {
        switch (op) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(display);

        if (operator && previousValue !== null) {
            const newValue = calculate(previousValue, inputValue, operator);
            setDisplay(String(newValue));
            setPreviousValue(null);
            setOperator(null);
            setWaitingForOperand(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setOperator(null);
        setPreviousValue(null);
        setWaitingForOperand(false);
    };

    const handleDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs">
                <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Calculator</h1>

                {/* Display */}
                <div className="bg-gray-900 text-white text-right text-3xl p-4 rounded-lg mb-4 font-mono overflow-hidden">
                    {display}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={handleClear}
                        className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        AC
                    </button>
                    <button
                        onClick={() => handleOperator('/')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        ÷
                    </button>
                    <button
                        onClick={() => handleOperator('*')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        ×
                    </button>

                    {[7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumber(String(num))}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => handleOperator('-')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        −
                    </button>

                    {[4, 5, 6].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumber(String(num))}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => handleOperator('+')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        +
                    </button>

                    {[1, 2, 3].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumber(String(num))}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleEquals}
                        className="row-span-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                    >
                        =
                    </button>

                    <button
                        onClick={() => handleNumber('0')}
                        className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDecimal}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                    >
                        .
                    </button>
                </div>
            </div>
        </div>
    );
}

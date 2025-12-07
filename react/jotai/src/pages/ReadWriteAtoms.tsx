import React from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// Read-only atom example
const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Write-only atom example
const textAtom = atom('');
const uppercaseAtom = atom(
  null,
  (get, set, newValue: string) => {
    set(textAtom, newValue.toUpperCase());
  }
);

const ReadWriteAtoms: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Read-Only & Write-Only Atoms
        </h1>
        <p className="text-gray-600 mb-8">
          Examples of derived atoms with read-only and write-only behavior.
        </p>
      </div>

      {/* Read-Only Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Read-Only Atom
        </h2>
        <p className="text-gray-600 mb-4">
          The doubleCount atom is read-only and automatically computes based on count.
        </p>
        <ReadOnlyExample />
      </div>

      {/* Write-Only Section */}
      <div className="bg-green-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Write-Only Atom
        </h2>
        <p className="text-gray-600 mb-4">
          The uppercase atom is write-only and transforms input to uppercase before storing.
        </p>
        <WriteOnlyExample />
      </div>
    </div>
  );
};

const ReadOnlyExample: React.FC = () => {
  const [count, setCount] = useAtom(countAtom);
  const doubleCount = useAtomValue(doubleCountAtom);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Increment Count
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="text-lg">
          <span className="font-semibold">Count:</span> {count}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Double Count (read-only):</span> {doubleCount}
        </p>
      </div>
    </div>
  );
};

const WriteOnlyExample: React.FC = () => {
  const text = useAtomValue(textAtom);
  const setUppercase = useSetAtom(uppercaseAtom);

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          onChange={(e) => setUppercase(e.target.value)}
          placeholder="Type something..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="text-lg">
          <span className="font-semibold">Stored Text (uppercase):</span> {text}
        </p>
      </div>
    </div>
  );
};

export default ReadWriteAtoms;

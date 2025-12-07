import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TextLength from './pages/Textlength';
import TodoPage from './pages/Todos';
import ReadWriteAtoms from './pages/ReadWriteAtoms';
import AtomCreator from './pages/AtomCreator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <header className="bg-white border-b border-gray-200 mb-6">
              <nav className="flex space-x-6 px-6 py-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/text"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Text
                </Link>
                <Link
                  to="/todos"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Todos
                </Link>
                <Link
                  to="/readwrite"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Read/Write
                </Link>
                <Link
                  to="/atomcreator"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  atomcreator
                </Link>
              </nav>
            </header>
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/text" element={<TextLength />} />
                <Route path="/todos" element={<TodoPage />} />
                <Route path="/readwrite" element={<ReadWriteAtoms />} />
                <Route path="/atomcreator" element={<AtomCreator />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;

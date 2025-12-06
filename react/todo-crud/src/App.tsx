import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AsyncCrud from './pages/AsyncCrud';
import LocalCrud from './pages/LocalCrud';

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
                  to="/async"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Async CRUD
                </Link>
                <Link
                  to="/local"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Local CRUD
                </Link>
              </nav>
            </header>
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/async" element={<AsyncCrud />} />
                <Route path="/local" element={<LocalCrud />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;

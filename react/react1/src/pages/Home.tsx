import React from 'react';

import Hero from '@/components/Hero';
import { Link } from 'react-router';

const Home: React.FC = () => {
    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <nav className="bg-white shadow px-4 py-2 flex space-x-4">
                <Link to="/" className="text-blue-600 hover:underline">
                    Home
                </Link>
                <Link to="/settimeout" className="text-blue-600 hover:underline">
                    Set Timeout
                </Link>
            </nav>
            <Hero />
        </div>
    );
};

export default Home;


import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="text-2xl font-bold text-indigo-600">
          <Link href="/">
            <span>PennyBuddy</span>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8">
          {/* <Link href="/">
            <span className="text-gray-700 hover:text-indigo-600">Home</span>
          </Link> */}
        </nav>

        <div className="flex space-x-8">
          <Link href="/login">
            <span className="text-gray-700 hover:text-indigo-600">Login</span>
          </Link>
          <Link href="/signup">
            <span className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500">
              Register
            </span>
          </Link>
        </div>

        <div className="md:hidden">
          <button className="text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

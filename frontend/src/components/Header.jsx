// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AucNet</h1>
        </Link>
        <div className="flex items-center">
          {auth.user ? (
            <>
              <span className="text-gray-700 dark:text-gray-200 mr-4">Hello, {auth.user.firstName}</span>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 border border-red-700 rounded transition-colors duration-300"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 dark:text-blue-300 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2 transition-colors duration-300">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded transition-colors duration-300">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

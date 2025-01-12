// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { FaBell } from "react-icons/fa"; // Import bell icon

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const { notifications } = useContext(NotificationContext);
  const [showModal, setShowModal] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            AucNet
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          {auth.user ? (
            <>
              {/* Notification Bell Icon */}
              <div className="relative">
                <button
                  onClick={toggleModal}
                  className="relative focus:outline-none"
                >
                  <FaBell className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Modal */}
                {showModal && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50">
                    <div className="py-2">
                      <h2 className="px-4 py-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Notifications
                      </h2>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-2 text-gray-600 dark:text-gray-300">
                            No notifications.
                          </p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className="px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-300">
                                    {notif.message}
                                  </p>
                                  <small className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(notif.timestamp).toLocaleString()}
                                  </small>
                                </div>
                                <Link to={`/auctions/${notif.auctionId}`}>
                                  <button
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                    onClick={() => {
                                      // Optionally, trigger a toast or other action
                                      // e.g., toast.info("Navigating to auction...", { ... })
                                    }}
                                  >
                                    View
                                  </button>
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 text-right">
                        <button
                          onClick={toggleModal}
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Existing Links and Buttons */}
              <Link
                to="/my-products"
                className="text-blue-600 dark:text-blue-300 hover:underline"
              >
                My Products
              </Link>
              <Link
                to="/my-auctions"
                className="text-blue-600 dark:text-blue-300 hover:underline"
              >
                My Auctions
              </Link>
              <span className="text-gray-700 dark:text-gray-200">
                Hello, {auth.user.firstName}
              </span>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 border border-red-700 rounded"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 dark:text-blue-300 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded">
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

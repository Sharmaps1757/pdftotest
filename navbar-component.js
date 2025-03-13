// components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };
  
  // Don't show navbar on test taking page
  if (location.pathname.includes('/take-test/')) {
    return null;
  }
  
  return (
    <nav className="navbar px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="logo">
        <Link to="/" className="text-2xl font-bold gradient-text">
          TestMaster
        </Link>
      </div>
      
      <div className="nav-links">
        {isLoggedIn ? (
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/tests" 
              className={`nav-link ${location.pathname === '/tests' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
            >
              My Tests
            </Link>
            <Link 
              to="/create-test" 
              className={`nav-link ${location.pathname === '/create-test' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
            >
              Create Test
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              to="/login"
              className="px-4 py-2 text-white hover:text-purple-300 transition"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// index.js - Main application file
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Dashboard from './dashboard-component';
import CreateTest from './create-test-component';
import TestList from './test-list-component';
import TakeTest from './take-test-component';
import Login from './auth-components';
import Register from './components/Register';
import Navbar from './navbar-component';

// Styles
import './index.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/create-test" element={isLoggedIn ? <CreateTest /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/tests" element={isLoggedIn ? <TestList /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/take-test/:id" element={<TakeTest />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

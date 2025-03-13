// components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    bestScore: 0
  });
  
  useEffect(() => {
    // Load data from localStorage
    const storedTests = JSON.parse(localStorage.getItem('tests') || '[]');
    const storedResults = JSON.parse(localStorage.getItem('results') || '[]');
    
    setTests(storedTests);
    setResults(storedResults);
    
    // Calculate statistics
    if (storedTests.length > 0 && storedResults.length > 0) {
      const completedTests = new Set(storedResults.map(r => r.testId)).size;
      const scores = storedResults.map(r => r.score);
      const averageScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
      
      setStats({
        totalTests: storedTests.length,
        completedTests,
        averageScore,
        bestScore
      });
    }
  }, []);
  
  const getRecentTests = () => {
    return [...tests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  };
  
  const getRecentResults = () => {
    return [...results].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 3);
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Section */}
      <div className="stats-section mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dashboard-card p-4">
            <h3 className="text-gray-400 mb-1">Total Tests</h3>
            <p className="stat-value text-3xl">{stats.totalTests}</p>
          </div>
          <div className="dashboard-card p-4">
            <h3 className="text-gray-400 mb-1">Completed Tests</h3>
            <p className="stat-value text-3xl">{stats.completedTests}</p>
          </div>
          <div className="dashboard-card p-4">
            <h3 className="text-gray-400 mb-1">Average Score</h3>
            <p className="stat-value text-3xl">{stats.averageScore.toFixed(1)}%</p>
          </div>
          <div className="dashboard-card p-4">
            <h3 className="text-gray-400 mb-1">Best Score</h3>
            <p className="stat-value text-3xl">{stats.bestScore.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="actions-section mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/create-test" 
            className="dashboard-card p-6 text-center hover:border-purple-500 group"
          >
            <div className="icon-container mb-3 mx-auto w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center group-hover:bg-purple-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Create New Test</h3>
            <p className="text-gray-400 text-sm">Upload PDFs and create a new test with customized sections</p>
          </Link>
          
          <Link 
            to="/tests" 
            className="dashboard-card p-6 text-center hover:border-blue-500 group"
          >
            <div className="icon-container mb-3 mx-auto w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center group-hover:bg-blue-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">View All Tests</h3>
            <p className="text-gray-400 text-sm">Browse and manage your existing tests</p>
          </Link>
          
          <div className="dashboard-card p-6 text-center hover:border-green-500 group">
            <div className="icon-container mb-3 mx-auto w-16 h-16 rounded-full bg-green-900 flex items-center justify-center group-hover:bg-green-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">View Analytics</h3>
            <p className="text-gray-400 text-sm">Analyze your performance across all tests</p>
          </div>
        </div>
      </div>
      
      {/* Recent Tests */}
      <div className="recent-tests-section mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Tests</h2>
          <Link to="/tests" className="text-purple-400 hover:text-purple-300">View All →</Link>
        </div>
        
        {getRecentTests().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getRecentTests().map(test => (
              <div key={test.id} className="dashboard-card p-4">
                <h3 className="font-medium mb-1">{test.name}</h3>
                <p className="text-sm text-gray-400 mb-3">Created on {new Date(test.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{test.sections.length} sections</span>
                  <Link 
                    to={`/take-test/${test.id}`}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
                  >
                    Take Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No tests created yet. Get started by creating your first test!</p>
        )}
      </div>
      
      {/* Recent Results */}
      <div className="recent-results-section">
        <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
        
        {getRecentResults().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getRecentResults().map(result => (
              <div key={result.id} className="dashboard-card p-4">
                <h3 className="font-medium mb-1">{result.testName}</h3>
                <p className="text-sm text-gray-400 mb-3">Completed on {new Date(result.completedAt).toLocaleDateString()}</p>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      result.score >= 80 ? 'bg-green-500' : 
                      result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className="text-sm">{result.score.toFixed(1)}%</span>
                  </span>
                  <span className="text-sm">{result.correctAnswers}/{result.totalQuestions} correct</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No test results yet. Take a test to see your results here!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

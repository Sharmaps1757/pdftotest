// components/TestList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load tests from localStorage
    const storedTests = JSON.parse(localStorage.getItem('tests') || '[]');
    const storedResults = JSON.parse(localStorage.getItem('results') || '[]');
    
    setTests(storedTests);
    setResults(storedResults);
    setLoading(false);
  }, []);
  
  const deleteTest = (id) => {
    if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      const updatedTests = tests.filter(test => test.id !== id);
      localStorage.setItem('tests', JSON.stringify(updatedTests));
      setTests(updatedTests);
      toast.success('Test deleted successfully');
    }
  };
  
  const getBestScore = (testId) => {
    const testResults = results.filter(result => result.testId === testId);
    if (testResults.length === 0) return null;
    
    const bestScore = Math.max(...testResults.map(result => result.score));
    return bestScore;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="test-list-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tests</h1>
        <Link 
          to="/create-test"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Create New Test
        </Link>
      </div>
      
      {tests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tests.map(test => {
            const bestScore = getBestScore(test.id);
            return (
              <div key={test.id} className="test-card bg-gray-900 p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="test-info flex-grow mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold mb-2">{test.name}</h2>
                    <div className="test-meta flex flex-wrap gap-4 text-sm text-gray-400">
                      <span>Created: {new Date(test.createdAt).toLocaleDateString()}</span>
                      <span>Duration: {test.duration} minutes</span>
                      <span>Sections: {test.sections.length}</span>
                      <span>Questions: {test.sections.reduce((sum, section) => sum + section.questions.length, 0)}</span>
                    </div>
                  </div>
                  
                  <div className="test-actions flex flex-col md:flex-row gap-2 items-center">
                    {bestScore !== null && (
                      <div className="best-score px-3 py-1 rounded bg-gray-800 text-sm">
                        Best Score: <span className={`font-bold ${
                          bestScore >= 80 ? 'text-green-400' : 
                          bestScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{bestScore.toFixed(1)}%</span>
                      </div>
                    )}
                    
                    <Link 
                      to={`/take-test/${test.id}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-center"
                    >
                      Take Test
                    </Link>
                    
                    <button 
                      onClick={() => deleteTest(test.id)}
                      className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="sections-preview mt-4">
                  <h3 className="text-sm font-medium mb-2">Sections:</h3>
                  <div className="flex flex-wrap gap-2">
                    {test.sections.map(section => (
                      <div key={section.id} className="section-pill px-3 py-1 bg-gray-800 rounded-full text-xs">
                        {section.name} ({section.questions.length} questions)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state text-center py-12">
          <div className="icon-container mb-4 mx-auto w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Tests Found</h2>
          <p className="text-gray-400 mb-6">You haven't created any tests yet. Get started by creating your first test.</p>
          <Link 
            to="/create-test"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Create Your First Test
          </Link>
        </div>
      )}
    </div>
  );
};

export default TestList;

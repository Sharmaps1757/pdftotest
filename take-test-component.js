// components/TakeTest.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load test from localStorage
  useEffect(() => {
    const loadTest = () => {
      try {
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const foundTest = tests.find(t => t.id.toString() === id);
        
        if (foundTest) {
          setTest(foundTest);
          setTimeLeft(foundTest.duration * 60); // Convert minutes to seconds
          
          // Initialize answers
          const initialAnswers = {};
          foundTest.sections.forEach(section => {
            section.questions.forEach(question => {
              initialAnswers[`${section.id}-${question.id}`] = question.type === 'integer' ? '' : null;
            });
          });
          setAnswers(initialAnswers);
        } else {
          toast.error('Test not found');
          navigate('/tests');
        }
      } catch (error) {
        console.error('Error loading test:', error);
        toast.error('Error loading test');
      } finally {
        setLoading(false);
      }
    };
    
    loadTest();
  }, [id, navigate]);
  
  // Timer countdown
  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            submitTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, timeLeft]);
  
  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer changes
  const handleAnswerChange = (sectionId, questionId, value) => {
    setAnswers({
      ...answers,
      [`${sectionId}-${questionId}`]: value
    });
  };
  
  // Navigate to specific question
  const goToQuestion = (sectionIndex, questionIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(questionIndex);
  };
  
  // Submit test
  const submitTest = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Calculate score
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    test.sections.forEach(section => {
      section.questions.forEach(question => {
        totalQuestions++;
        const userAnswer = answers[`${section.id}-${question.id}`];
        
        if (question.type === 'single' && userAnswer === question.correctAnswer) {
          correctAnswers++;
        } else if (question.type === 'integer' && parseInt(userAnswer) === parseInt(question.correctAnswer)) {
          correctAnswers++;
        }
      });
    });
    
    const score = (correctAnswers / totalQuestions) * 100;
    
    // Save result to localStorage
    const result = {
      id: Date.now(),
      testId: test.id,
      testName: test.name,
      score,
      totalQuestions,
      correctAnswers,
      completedAt: new Date().toISOString(),
      timeSpent: test.duration * 60 - timeLeft
    };
    
    const existingResults = JSON.parse(localStorage.getItem('results') || '[]');
    localStorage.setItem('results', JSON.stringify([...existingResults, result]));
    
    toast.success('Test submitted successfully!');
    navigate('/tests');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  
  if (!test) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl mb-4">Test not found</h2>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded"
          onClick={() => navigate('/tests')}
        >
          Back to Tests
        </button>
      </div>
    );
  }
  
  const currentSectionData = test.sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];
  
  return (
    <div className="test-container flex h-screen">
      {/* Sidebar Navigation */}
      <div className="sidebar w-64 bg-gray-900 overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold mb-2">{test.name}</h2>
          <div className="time-left text-xl font-mono bg-gray-800 p-2 rounded text-center">
            {timeLeft > 0 ? formatTime(timeLeft) : 'Time Up!'}
          </div>
        </div>
        
        <div className="p-4">
          {test.sections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-4">
              <h3 className="font-medium mb-2">{section.name}</h3>
              <div className="grid grid-cols-5 gap-2">
                {section.questions.map((question, questionIndex) => {
                  // Determine status for color
                  const isActive = currentSection === sectionIndex && currentQuestion === questionIndex;
                  const isAnswered = answers[`${section.id}-${question.id}`] !== null && 
                                    answers[`${section.id}-${question.id}`] !== '';
                  
                  let bgColorClass = 'bg-gray-800';
                  if (isActive) bgColorClass = 'bg-purple-700';
                  else if (isAnswered) bgColorClass = 'bg-green-700';
                  
                  return (
                    <button
                      key={question.id}
                      className={`${bgColorClass} w-8 h-8 rounded flex items-center justify-center hover:bg-gray-700 transition`}
                      onClick={() => goToQuestion(sectionIndex, questionIndex)}
                    >
                      {questionIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-black overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="question-header flex justify-between items-center mb-6">
            <h3 className="text-xl">
              {currentSectionData.name} - Question {currentQuestion + 1} of {currentSectionData.questions.length}
            </h3>
            <span className="px-3 py-1 bg-gray-800 rounded">
              {currentQuestionData.type === 'single' ? 'Single Choice' : 'Integer Value'}
            </span>
          </div>
          
          <div className="question-container p-6 bg-gray-900 rounded-lg shadow-lg mb-6 backdrop-filter backdrop-blur-sm bg-opacity-90">
            <div className="question-text text-lg mb-4">
              {currentQuestionData.text}
            </div>
            
            {currentQuestionData.image && (
              <div className="question-image mb-4">
                <img 
                  src={currentQuestionData.image} 
                  alt="Question illustration" 
                  className="max-w-full rounded"
                />
              </div>
            )}
            
            <div className="answer-section mt-6">
              {currentQuestionData.type === 'single' ? (
                <div className="options-list space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`option-item p-3 border rounded-lg cursor-pointer transition ${
                        answers[`${currentSectionData.id}-${currentQuestionData.id}`] === option
                          ? 'border-purple-500 bg-purple-900 bg-opacity-40'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => handleAnswerChange(currentSectionData.id, currentQuestionData.id, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="integer-input">
                  <label className="block mb-2">Enter your answer (integer only):</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                    value={answers[`${currentSectionData.id}-${currentQuestionData.id}`] || ''}
                    onChange={(e) => handleAnswerChange(currentSectionData.id, currentQuestionData.id, e.target.value)}
                    placeholder="Enter integer value"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="navigation-buttons flex justify-between">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                } else if (currentSection > 0) {
                  setCurrentSection(currentSection - 1);
                  setCurrentQuestion(test.sections[currentSection - 1].questions.length - 1);
                }
              }}
              disabled={currentSection === 0 && currentQuestion === 0}
            >
              Previous
            </button>
            
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              onClick={() => {
                const currentSectionQuestions = test.sections[currentSection].questions.length;
                
                if (currentQuestion < currentSectionQuestions - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                } else if (currentSection < test.sections.length - 1) {
                  setCurrentSection(currentSection + 1);
                  setCurrentQuestion(0);
                }
              }}
              disabled={
                currentSection === test.sections.length - 1 && 
                currentQuestion === test.sections[currentSection].questions.length - 1
              }
            >
              Next
            </button>
          </div>
          
          <div className="submit-container text-center mt-8">
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={submitTest}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;

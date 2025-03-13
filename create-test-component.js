// components/CreateTest.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

const CreateTest = () => {
  const navigate = useNavigate();
  const [testName, setTestName] = useState('');
  const [testDuration, setTestDuration] = useState(60);
  const [sections, setSections] = useState([
    { id: 1, name: 'Section 1', pdfFile: null, answerPdfFile: null, questions: [] }
  ]);
  const [loading, setLoading] = useState(false);
  
  const handleAddSection = () => {
    setSections([
      ...sections, 
      { 
        id: sections.length + 1, 
        name: `Section ${sections.length + 1}`, 
        pdfFile: null, 
        answerPdfFile: null,
        questions: [] 
      }
    ]);
  };
  
  const handleRemoveSection = (id) => {
    if (sections.length === 1) {
      toast.error('You must have at least one section');
      return;
    }
    setSections(sections.filter(section => section.id !== id));
  };
  
  const updateSectionName = (id, newName) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, name: newName } : section
    ));
  };
  
  const handleFileUpload = async (event, sectionId, fileType) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    
    try {
      setLoading(true);
      // Read file as array buffer for processing
      const fileBuffer = await file.arrayBuffer();
      
      // Parse the PDF
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Extract questions from PDF (this would need a more sophisticated implementation)
      // This is a simplified version that assumes each page is a question
      let extractedQuestions = [];
      
      // In a real app, you would use a library like pdf.js to extract text
      // For this example, we'll create dummy questions based on page count
      for (let i = 0; i < pageCount; i++) {
        extractedQuestions.push({
          id: i + 1,
          text: `Question ${i + 1} (extracted from PDF)`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          type: Math.random() > 0.8 ? 'integer' : 'single', // 20% chance of integer type
          image: null
        });
      }
      
      setSections(sections.map(section => {
        if (section.id === sectionId) {
          return fileType === 'questions'
            ? { ...section, pdfFile: file, questions: extractedQuestions }
            : { ...section, answerPdfFile: file };
        }
        return section;
      }));
      
      toast.success(`${fileType === 'questions' ? 'Questions' : 'Answer key'} PDF processed successfully`);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Error processing PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveTest = () => {
    if (!testName.trim()) {
      toast.error('Please enter a test name');
      return;
    }
    
    // Check if all sections have PDFs uploaded
    const incompleteSections = sections.filter(section => !section.pdfFile || !section.answerPdfFile);
    if (incompleteSections.length > 0) {
      toast.error('Please upload both question and answer PDFs for all sections');
      return;
    }
    
    // In a real app, you would save this to a database
    const test = {
      id: Date.now(),
      name: testName,
      duration: testDuration,
      sections: sections.map(section => ({
        id: section.id,
        name: section.name,
        questions: section.questions
      })),
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage for this example
    const existingTests = JSON.parse(localStorage.getItem('tests') || '[]');
    localStorage.setItem('tests', JSON.stringify([...existingTests, test]));
    
    toast.success('Test created successfully!');
    navigate('/tests');
  };
  
  return (
    <div className="create-test-container">
      <h1 className="text-3xl font-bold mb-6">Create New Test</h1>
      
      <div className="form-group mb-4">
        <label htmlFor="testName" className="block text-lg mb-2">Test Name</label>
        <input
          type="text"
          id="testName"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Enter test name"
        />
      </div>
      
      <div className="form-group mb-6">
        <label htmlFor="testDuration" className="block text-lg mb-2">Test Duration (minutes)</label>
        <input
          type="number"
          id="testDuration"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          value={testDuration}
          onChange={(e) => setTestDuration(parseInt(e.target.value) || 0)}
          min="1"
        />
      </div>
      
      <div className="sections-container mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Test Sections</h2>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={handleAddSection}
          >
            Add Section
          </button>
        </div>
        
        {sections.map((section) => (
          <div key={section.id} className="section-card p-4 mb-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <input
                type="text"
                className="text-lg font-medium bg-gray-800 border-b border-gray-600 p-1 text-white"
                value={section.name}
                onChange={(e) => updateSectionName(section.id, e.target.value)}
              />
              <button 
                className="p-2 text-red-400 hover:text-red-500"
                onClick={() => handleRemoveSection(section.id)}
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="upload-container">
                <label className="block mb-2">Upload Questions PDF</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id={`questions-${section.id}`}
                    onChange={(e) => handleFileUpload(e, section.id, 'questions')}
                  />
                  <label
                    htmlFor={`questions-${section.id}`}
                    className="cursor-pointer flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {section.pdfFile ? 'Change PDF' : 'Select PDF'}
                  </label>
                </div>
                {section.pdfFile && (
                  <p className="mt-2 text-sm text-green-400">
                    {section.pdfFile.name} ({section.questions.length} questions)
                  </p>
                )}
              </div>
              
              <div className="upload-container">
                <label className="block mb-2">Upload Answer Key PDF</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id={`answers-${section.id}`}
                    onChange={(e) => handleFileUpload(e, section.id, 'answers')}
                  />
                  <label
                    htmlFor={`answers-${section.id}`}
                    className="cursor-pointer flex items-center justify-center w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    {section.answerPdfFile ? 'Change PDF' : 'Select PDF'}
                  </label>
                </div>
                {section.answerPdfFile && (
                  <p className="mt-2 text-sm text-green-400">
                    {section.answerPdfFile.name}
                  </p>
                )}
              </div>
            </div>
            
            {section.questions.length > 0 && (
              <div className="questions-preview mt-4">
                <h3 className="text-md font-medium mb-2">Questions Preview:</h3>
                <p className="text-sm text-gray-400">
                  {section.questions.length} questions extracted. 
                  {section.questions.filter(q => q.type === 'integer').length} integer type, 
                  {section.questions.filter(q => q.type === 'single').length} single choice.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="actions flex justify-end">
        <button 
          className="px-6 py-2 mr-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          onClick={() => navigate('/tests')}
        >
          Cancel
        </button>
        <button 
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={saveTest}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Save Test'}
        </button>
      </div>
    </div>
  );
};

export default CreateTest;

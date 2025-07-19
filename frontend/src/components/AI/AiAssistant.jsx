import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { askAI } from '../../services/aiService'; // Import the service function

const AiAssistant = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a query.');
            return;
        }
        
        setLoading(true);
        setResponse('');
        setError('');

        try {
            // The service now returns the string directly
            const aiResponse = await askAI(query.trim());
            setResponse(aiResponse);
        } catch (err) {
            console.error('AI request error:', err);
            setError(err.message || 'AI request failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setQuery('');
        setResponse('');
        setError('');
    };

    const suggestedQuestions = [
        "What is JavaScript?",
        "How do I learn machine learning?",
        "Explain React components",
        "What is the difference between Python and Java?",
        "How to learn web development?"
    ];

    const handleSuggestedQuestion = (question) => {
        setQuery(question);
        setResponse('');
        setError('');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>🤖 AI Study Assistant</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
                Ask me anything about programming, technology, or study topics!
            </p>

            <form onSubmit={handleAskAI} style={{ marginBottom: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask any study-related query..."
                        rows={4}
                        style={{ 
                            width: '100%', 
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px'
                        }}
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Asking AI...' : 'Ask AI'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleClearChat}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear
                    </button>
                </div>
            </form>

            <div style={{ marginBottom: '1rem' }}>
                <h4>💡 Suggested Questions:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {suggestedQuestions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestedQuestion(question)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#1b1010ff',
                                border: '1px solid #ddd',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>

            {response && (
                <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #c3e6c3',
                    borderRadius: '5px',
                    lineHeight: '1.6'
                }}>
                    <strong>🤖 AI Response:</strong>
                    <ReactMarkdown>{response}</ReactMarkdown>
                </div>
            )}

            {error && (
                <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '5px'
                }}>
                    <strong>❌ Error:</strong>
                    <p style={{ marginTop: '0.5rem' }}>{error}</p>
                </div>
            )}

            {loading && (
                <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#d1ecf1',
                    border: '1px solid #bee5eb',
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
                    <p>🤖 Thinking... Please wait</p>
                </div>
            )}
        </div>
    );
};

export default AiAssistant;
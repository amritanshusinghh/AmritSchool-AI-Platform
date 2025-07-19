import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
// FIX: Changed 'generateQuiz' to 'getQuiz' to match the exported function name
import { getQuiz } from '../../services/aiService';
import './Quiz.css';

const Quiz = () => {
    const [topic, setTopic] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            toast.error('Please enter a topic.');
            return;
        }
        setLoading(true);
        setQuiz(null);
        setAnswers({});
        setScore(null);
        const toastId = toast.loading('Generating your quiz...');

        try {
            // FIX: Call the correctly imported 'getQuiz' function
            const quizData = await getQuiz(topic);
            if (quizData && quizData.questions) {
                setQuiz(quizData);
                toast.success('Quiz generated successfully!', { id: toastId });
            } else {
                throw new Error("Received invalid quiz data from AI.");
            }
        } catch (err) {
            toast.error(err.message || 'Failed to generate quiz.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, option) => {
        setAnswers({
            ...answers,
            [questionIndex]: option,
        });
    };

    const handleSubmitQuiz = () => {
        let currentScore = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                currentScore++;
            }
        });
        setScore(currentScore);
        toast.success(`You scored ${currentScore} out of ${quiz.questions.length}!`);
    };

    return (
        <div className="quiz-container">
            {!quiz ? (
                <div className="card">
                    <h2>🧠 AI Quiz Generator</h2>
                    <p>Enter any topic, and our AI will create a 5-question multiple-choice quiz for you.</p>
                    <form onSubmit={handleGenerateQuiz}>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., 'JavaScript Fundamentals' or 'History of Rome'"
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Quiz'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="card">
                    <h2>Quiz on: {quiz.topic}</h2>
                    {quiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="question-block">
                            <h4>{qIndex + 1}. {q.question}</h4>
                            <div className="options-group">
                                {q.options.map((option, oIndex) => (
                                    <label
                                        key={oIndex}
                                        className={`option-label ${answers[qIndex] === option ? 'selected' : ''} ${score !== null && option === q.correctAnswer ? 'correct' : ''} ${score !== null && answers[qIndex] === option && option !== q.correctAnswer ? 'incorrect' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            value={option}
                                            checked={answers[qIndex] === option}
                                            onChange={() => handleAnswerChange(qIndex, option)}
                                            disabled={score !== null}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {score === null ? (
                        <button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length !== quiz.questions.length}>
                            Submit Quiz
                        </button>
                    ) : (
                        <div className="results-block">
                            <h3>Your Score: {score} / {quiz.questions.length}</h3>
                            <button onClick={() => { setTopic(''); setQuiz(null); }}>Create a New Quiz</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Quiz;
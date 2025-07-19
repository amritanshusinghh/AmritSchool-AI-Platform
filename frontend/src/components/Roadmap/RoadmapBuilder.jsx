import React, { useState } from 'react';
import { getRoadmap } from '../../services/aiService';

const RoadmapBuilder = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('Please enter a learning goal.');
      return;
    }
    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      // The getRoadmap service now returns the clean roadmap object directly.
      const roadmapData = await getRoadmap(goal);
      setRoadmap(roadmapData);
    } catch (err) {
      // --- THIS IS THE FIX ---
      // This logic extracts the specific error message sent from our backend.
      const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      console.error('Error generating roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🗺️ AI Roadmap Generator</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Enter a topic or a goal you want to learn, and the AI will generate a step-by-step learning plan for you.
      </p>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., 'Learn React from scratch' or 'Master Data Science'"
          required
          style={{ width: '100%', padding: '12px', fontSize: '16px', boxSizing: 'border-box', marginBottom: '1rem' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

      {roadmap && (
        <div>
          <h3>Your Roadmap to "{roadmap.goal}"</h3>
          <p><strong>Estimated Duration:</strong> {roadmap.estimatedDuration}</p>
          {roadmap.steps.map((step) => (
            <div key={step.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h4>Step {step.id}: {step.title}</h4>
              <p><strong>Duration:</strong> {step.duration}</p>
              <p>{step.description}</p>
              <h5>Suggested Resources:</h5>
              <ul>
                {step.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapBuilder;
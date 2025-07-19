import API from './api';

export const askAI = (query) => API.post('/ai/chat', { query });

export const getQuiz = async (topic) => {
  // The backend now sends fully parsed JSON.
  const { data } = await API.post('/ai/quiz', { topic });
  if (data.status === 'success' && data.quiz) {
    return data.quiz; // Return the quiz object directly
  } else {
    throw new Error(data.error || 'Failed to retrieve quiz from server.');
  }
};

export const getRoadmap = async (goal) => {
  // The backend now sends fully parsed JSON.
  const { data } = await API.post('/ai/roadmap', { goal });
  if (data.status === 'success' && data.roadmap) {
    return data.roadmap; // Return the roadmap object directly
  } else {
    throw new Error(data.error || 'Failed to retrieve roadmap from server.');
  }
};
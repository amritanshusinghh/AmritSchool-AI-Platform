import API from './api';

export const createCustomRoadmap = (roadmapData) => API.post('/roadmap/create', roadmapData);
export const fetchSavedRoadmaps = () => API.get('/roadmap');
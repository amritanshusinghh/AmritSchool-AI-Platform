

import API from './api';

export const getRecentMessages = async (roomId) => {
    const { data } = await API.get(`/chat/recent/${roomId}`);
    return data;
};
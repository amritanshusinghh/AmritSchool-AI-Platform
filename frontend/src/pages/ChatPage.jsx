import React from 'react';
import Layout from '../components/Shared/Layout';
import ChatRoom from '../components/Chat/ChatRoom';

const ChatPage = () => {
    return (
        <Layout>
            <h1>Study Chat Room 💬</h1>
            <ChatRoom />
        </Layout>
    );
};

export default ChatPage;

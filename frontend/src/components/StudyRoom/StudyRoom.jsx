import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from '../../utils/authUtils';
import { Timer } from './Timer';
// The import for Layout has been removed

const socket = io(process.env.REACT_APP_API_URL, {
    auth: { token: getToken() }
});

const StudyRoom = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('study_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        return () => socket.off('study_message');
    }, []);

    const handleSend = () => {
        if (input.trim() !== '') {
            socket.emit('study_message', input);
            setInput('');
        }
    };

    return (
        // The <Layout> wrapper has been removed from here
        <>
            <Timer />

            <div className="card">
                <h3>Group Chat</h3>
                <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '1rem', borderRadius: 'var(--border-radius)' }}>
                    {messages.map((msg, idx) => <div key={idx}><strong>{msg.sender || 'User'}:</strong> {msg.text}</div>)}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        style={{ flexGrow: 1 }}
                        placeholder="Type your message"
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </>
    );
};

export default StudyRoom;
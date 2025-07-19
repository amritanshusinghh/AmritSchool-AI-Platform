import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { getToken } from '../../utils/authUtils';
import { Timer } from './Timer';
import { BASE_URL } from '../../config'; // Import BASE_URL

const StudyRoom = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const studyRoomId = "study-room-main"; // A dedicated ID for this study room

    useEffect(() => {
        // Use BASE_URL for the socket connection
        const newSocket = io(BASE_URL, {
            auth: { token: getToken() }
        });
        setSocket(newSocket);

        // Join the specific study room
        newSocket.emit('joinRoom', studyRoomId);

        // Listen for messages broadcast to this room
        newSocket.on('receiveMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // Clean up on component unmount
        return () => newSocket.disconnect();
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && socket) {
            const newMsg = {
                text: input,
                sender: 'You', // Optimistically add sender as "You"
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, newMsg]);

            // Emit the 'sendMessage' event with the correct payload
            socket.emit('sendMessage', { roomId: studyRoomId, message: input });
            setInput('');
        }
    };

    // Automatically scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <Timer />

            <div className="card">
                <h3>Group Chat</h3>
                <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '1rem', borderRadius: 'var(--border-radius)' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx}>
                            <strong>{msg.sender || 'User'}:</strong> {msg.text || msg.message}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                        style={{ flexGrow: 1 }}
                        placeholder="Type your message"
                    />
                    <button type="submit" disabled={!socket}>Send</button>
                </form>
            </div>
        </>
    );
};

export default StudyRoom;
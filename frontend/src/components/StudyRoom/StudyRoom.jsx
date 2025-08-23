import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { getToken } from '../../utils/authUtils';
import { Timer } from './Timer';
import { BASE_URL } from '../../config';
import { getUserProfile } from '../../services/authService';

const StudyRoom = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    
    const chatContainerRef = useRef(null);
    const studyRoomId = "study-room-main";

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await getUserProfile();
                setCurrentUser(data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };
        fetchUserProfile();

        const newSocket = io(BASE_URL, {
            auth: { token: getToken() }
        });
        setSocket(newSocket);
        newSocket.emit('joinRoom', studyRoomId);
        newSocket.on('receiveMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        return () => newSocket.disconnect();
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && socket) {
            const newMsg = {
                text: input,
                sender: 'You',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMsg]);
            socket.emit('sendMessage', { roomId: studyRoomId, message: input });
            setInput('');
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages]);

    return (
        <>
            <Timer />
            <div className="card">
                <h3>Group Chat</h3>
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-1rem", marginBottom: "1.5rem" }}>
                  Messages in this study room are not saved and will disappear when you leave.
                </p>
                <div 
                    ref={chatContainerRef}
                    style={{ 
                        height: '300px', 
                        overflowY: 'scroll', 
                        border: '1px solid #ccc', 
                        padding: '10px', 
                        marginBottom: '1rem', 
                        borderRadius: 'var(--border-radius)' 
                    }}
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ margin: '0.5rem 0' }}>
                            <b>{currentUser && msg.sender === currentUser.name ? 'You' : msg.sender}:</b> {msg.text || msg.message}{" "}
                            <span style={{ fontSize: "0.8rem", color: "gray" }}>
                                ({msg.timestamp})
                            </span>
                        </div>
                    ))}
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
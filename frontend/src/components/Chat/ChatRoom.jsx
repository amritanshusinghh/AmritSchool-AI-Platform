import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../config";
import { getUserProfile } from '../../services/authService';
import { getRecentMessages } from '../../services/chatService';

const formatDateSeparator = (dateString) => {
    if (!dateString) return null;
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return messageDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const ChatRoom = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    
    const chatContainerRef = useRef(null); 
    const chatRoomId = "study-group-1";

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

        const fetchMessages = async () => {
            try {
                const recentMessages = await getRecentMessages(chatRoomId);
                setMessages(recentMessages);
            } catch (error) {
                console.error("Failed to fetch recent messages", error);
            }
        };
        fetchMessages();

        const newSocket = io(BASE_URL, {
            auth: {
                token: localStorage.getItem("token"),
            },
        });
        setSocket(newSocket);
        newSocket.emit("joinRoom", chatRoomId);
        newSocket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !socket) return;
        const newMsg = {
            text: message,
            sender: "You",
            createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, newMsg]);
        socket.emit("sendMessage", { roomId: chatRoomId, message: message });
        setMessage("");
    };

    let lastMessageDate = null;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>💬 Real-time Chat Room</h2>
            <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-1rem", marginBottom: "1.5rem" }}>
                Heads up! Messages in this room are saved for 30 days. Please avoid sharing sensitive information.
            </p>
            
            <div
                ref={chatContainerRef}
                style={{
                    border: "1px solid #ccc",
                    height: "300px",
                    overflowY: "scroll",
                    marginBottom: "1rem",
                    padding: "1rem",
                }}
            >
                {messages.map((msg, idx) => {
                    let showDateSeparator = false;
                    const currentMessageDate = msg.createdAt ? new Date(msg.createdAt).toDateString() : null;

                    if (currentMessageDate && currentMessageDate !== lastMessageDate) {
                        showDateSeparator = true;
                        lastMessageDate = currentMessageDate;
                    }
                    
                    return (
                        <React.Fragment key={idx}>
                            {showDateSeparator && (
                                <div style={{ textAlign: 'center', margin: '1rem 0', color: '#888', background: '#f0f0f0', padding: '2px 0', borderRadius: '5px' }}>
                                    <span>{formatDateSeparator(msg.createdAt)}</span>
                                </div>
                            )}
                            <div style={{ margin: "0.5rem 0" }}>
                                <b>{currentUser && msg.sender === currentUser.name ? 'You' : msg.sender}:</b> {msg.text || msg.message}{" "}
                                <span style={{ fontSize: "0.8rem", color: "gray" }}>
                                    ({new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    placeholder="Type message..."
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ width: "70%", marginRight: "1rem" }}
                />
                <button type="submit" disabled={!socket}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
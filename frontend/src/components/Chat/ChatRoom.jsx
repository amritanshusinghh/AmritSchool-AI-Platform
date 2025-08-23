import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../config";
// --- START: New Feature ---
import { getUserProfile } from '../../services/authService';
import { getRecentMessages } from '../../services/chatService';
// --- END: New Feature ---

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // --- START: New Feature ---
  const [currentUser, setCurrentUser] = useState(null);
  // --- END: New Feature ---
  
  const chatContainerRef = useRef(null); 
  const chatRoomId = "study-group-1";

  useEffect(() => {
    // --- START: New Feature ---
    // Fetch the current user's profile to identify their messages
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
    // --- END: New Feature ---

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
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;
    const newMsg = {
      text: message,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    socket.emit("sendMessage", { roomId: chatRoomId, message: message });
    setMessage("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💬 Real-time Chat Room</h2>
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
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "0.5rem 0" }}>
            {/* --- START: New Feature --- */}
            {/* Conditionally display "You" or the sender's name */}
            <b>{currentUser && msg.sender === currentUser.name ? 'You' : msg.sender}:</b> {msg.text || msg.message}{" "}
            <span style={{ fontSize: "0.8rem", color: "gray" }}>
              ({msg.timestamp})
            </span>
            {/* --- END: New Feature --- */}
          </div>
        ))}
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
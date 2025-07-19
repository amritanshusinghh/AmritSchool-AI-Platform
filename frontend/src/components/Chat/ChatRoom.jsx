import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../config"; // Import the base URL from our config file

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Create a ref for the scrollable chat container
  const chatContainerRef = useRef(null); 
  const chatRoomId = "study-group-1";

  // Initialize Socket Connection
  useEffect(() => {
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

  // --- THIS IS THE FIX ---
  // This useEffect now directly controls the scroll position of the chat box.
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
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    socket.emit("sendMessage", { roomId: chatRoomId, message: message });
    setMessage("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💬 Real-time Chat Room</h2>
      <div
        ref={chatContainerRef} // Attach the ref to the scrollable div
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
            <b>{msg.sender || "Bot"}:</b> {msg.text || msg.message}{" "}
            <span style={{ fontSize: "0.8rem", color: "gray" }}>
              {msg.timestamp ? `(${msg.timestamp})` : ""}
            </span>
          </div>
        ))}
        {/* The messagesEndRef is no longer needed for this method */}
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
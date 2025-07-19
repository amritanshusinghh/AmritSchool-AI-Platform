import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../config"; // Import the base URL from our config file

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const chatRoomId = "study-group-1"; // Using a fixed room ID for all users

  // Initialize Socket Connection
  useEffect(() => {
    const newSocket = io(BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    setSocket(newSocket);

    // Join the chat room
    newSocket.emit("joinRoom", chatRoomId);

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up the connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []); // The empty dependency array ensures this runs only once.

  // Scroll to latest message
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return; // Also check if socket is initialized

    const newMsg = {
      text: message,
      sender: "You",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    // FIX: Emit 'sendMessage' with the correct payload
    socket.emit("sendMessage", { roomId: chatRoomId, message: message });
    setMessage("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💬 Real-time Chat Room</h2>
      <div
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
        <div ref={messagesEndRef} />
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
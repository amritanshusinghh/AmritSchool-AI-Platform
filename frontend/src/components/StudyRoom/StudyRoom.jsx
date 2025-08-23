import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { getToken } from "../../utils/authUtils";
import { Timer } from "./Timer";
import { BASE_URL } from "../../config";

const StudyRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Create a ref for the scrollable chat container
  const chatContainerRef = useRef(null);
  const studyRoomId = "study-room-main";

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      auth: { token: getToken() },
    });
    setSocket(newSocket);
    newSocket.emit("joinRoom", studyRoomId);
    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => newSocket.disconnect();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      // Create a new message object for optimistic UI update
      const newMsg = {
        text: input,
        sender: "You",
        // Add the formatted timestamp
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMsg]);

      // Send the message to the server
      socket.emit("sendMessage", { roomId: studyRoomId, message: input });
      setInput("");
    }
  };

  // This useEffect automatically scrolls the chat container to the bottom on new messages
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
        <div
          ref={chatContainerRef} // Attach the ref to the scrollable div
          style={{
            height: "300px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "1rem",
            borderRadius: "var(--border-radius)",
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} style={{ margin: "0.5rem 0" }}>
              {/* --- THIS IS THE FIX --- */}
              {/* Display the sender's name directly */}
              <b>{msg.sender || "User"}:</b> {msg.text || msg.message}{" "}
              <span style={{ fontSize: "0.8rem", color: "gray" }}>
                ({msg.timestamp})
              </span>
              {/* --- END OF FIX --- */}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} style={{ display: "flex", gap: "1rem" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(e)}
            style={{ flexGrow: 1 }}
            placeholder="Type your message"
          />
          <button type="submit" disabled={!socket}>
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default StudyRoom;

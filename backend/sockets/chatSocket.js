import Message from "../models/Message.js";
// No need to import User model here anymore

export const chatSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id, "as", socket.username);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.username} (${socket.id}) joined room ${roomId}`);
        });

        socket.on("sendMessage", async ({ roomId, message }) => {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const messagePayload = { 
                message, 
                sender: socket.username,
                timestamp 
            };

            socket.broadcast.to(roomId).emit("receiveMessage", messagePayload);

            // --- THIS IS THE FIX ---
            // Save message to database ONLY if it's the main chat room and the user is authenticated
            if (roomId === "study-group-1" && socket.userId) {
                try {
                    await Message.create({
                        room: roomId,
                        sender: socket.userId, // Use the ID from the authenticated socket
                        text: message
                    });
                } catch (error) {
                    console.error("Error saving message to database:", error);
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id, "as", socket.username);
        });
    });
};
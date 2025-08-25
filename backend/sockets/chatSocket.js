import Message from "../models/Message.js";

export const chatSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id, "as", socket.username);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.username} (${socket.id}) joined room ${roomId}`);
        });

        socket.on("sendMessage", async ({ roomId, message }) => {
            // --- THIS IS THE CHANGE ---
            // Create a full ISO timestamp for accurate date comparison
            const createdAt = new Date().toISOString(); 
            const timestamp = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const messagePayload = { 
                message, 
                sender: socket.username,
                timestamp,
                createdAt // Include the full timestamp
            };

            socket.broadcast.to(roomId).emit("receiveMessage", messagePayload);

            if (roomId === "study-group-1" && socket.userId) {
                try {
                    await Message.create({
                        room: roomId,
                        sender: socket.userId,
                        text: message,
                        createdAt: createdAt // Save the full timestamp to the DB
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
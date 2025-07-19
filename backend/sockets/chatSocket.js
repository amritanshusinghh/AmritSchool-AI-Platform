export const chatSocketHandler = (io) => {
    io.on("connection", (socket) => {
        // You can now access the username from the authenticated socket
        console.log("User connected:", socket.id, "as", socket.username);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.username} (${socket.id}) joined room ${roomId}`);
        });

        socket.on("sendMessage", ({ roomId, message }) => {
            // FIX: Broadcast the message with the username instead of the socket ID
            // Use socket.broadcast to send to everyone except the sender
            socket.broadcast.to(roomId).emit("receiveMessage", { message, sender: socket.username });
        });

        socket.on("disconnect", () => {
            if (socket.username) {
                console.log("User disconnected:", socket.id, "as", socket.username);
            } else {
                console.log("User disconnected:", socket.id);
            }
        });
    });
};
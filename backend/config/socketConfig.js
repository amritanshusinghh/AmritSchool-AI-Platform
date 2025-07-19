import { chatSocketHandler } from "../sockets/chatSocket.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const setupSockets = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select("email");
                if (user) {
                    socket.username = user.email; // Set username to user's email
                } else {
                    socket.username = 'Guest';
                }
            } else {
                socket.username = 'Guest';
            }
        } catch (error) {
            console.error("Socket authentication error:", error.message);
            socket.username = 'Guest'; // Fallback for invalid token
        }
        next();
    });

    chatSocketHandler(io);
};
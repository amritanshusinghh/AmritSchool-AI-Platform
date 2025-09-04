import Room from "../models/Room.js";
import Message from "../models/Message.js";

// Create a new chat room
export const createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const room = await Room.create({ name, createdBy: req.user.id, participants: [req.user.id] });
        res.status(201).json({ message: "Room created", room });
    } catch (err) {
        res.status(500).json({ message: "Error creating room", error: err.message });
    }
};

// Join existing room
export const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });

        if (!room.participants.includes(req.user.id)) {
            room.participants.push(req.user.id);
            await room.save();
        }

        res.json({ message: "Joined room", room });
    } catch (err) {
        res.status(500).json({ message: "Error joining room", error: err.message });
    }
};

// Fetch messages of a room
export const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ room: roomId }).populate("sender", "name").sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages", error: err.message });
    }
};

// Post message via HTTP (if needed, besides WebSocket)
export const postMessage = async (req, res) => {
    try {
        const { roomId, text } = req.body;
        const message = await Message.create({
            room: roomId,
            sender: req.user.id,
            text
        });
        res.status(201).json({ message: "Message sent", data: message });
    } catch (err) {
        res.status(500).json({ message: "Error sending message", error: err.message });
    }
};

// Fetch recent messages for a room
export const getRecentMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ room: roomId })
            .populate("sender", "name") 
            .sort({ createdAt: 1 });

        const formattedMessages = messages.map(msg => {
            const senderName = msg.sender ? msg.sender.name : 'Unknown User';
            return {
                message: msg.text,
                sender: senderName,
                createdAt: msg.createdAt 
            };
        });

        res.json(formattedMessages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching recent messages", error: err.message });
    }
};
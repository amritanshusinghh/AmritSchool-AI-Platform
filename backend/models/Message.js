// Ai-Amrit-School/backend/models/Message.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    room: { type: String, required: true }, // Changed to String to store room ID
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    // --- START: New Feature ---
    // The 'createdAt' field will now be used for the TTL index
    createdAt: { type: Date, default: Date.now, expires: '30d' } 
    // --- END: New Feature ---
});

// To make this work, ensure you have a TTL index in your MongoDB.
// Mongoose will automatically create this index for you.

export default mongoose.model("Message", messageSchema);
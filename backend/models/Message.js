import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomCode: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true }, // Socket ID of teacher or generic "Teacher"
}, {
    timestamps: true,
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };

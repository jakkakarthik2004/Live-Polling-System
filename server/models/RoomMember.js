const mongoose = require("mongoose");

const RoomMemberSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    name: { type: String, required: true },
    socketId: { type: String, required: true },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: true },
}, {
    timestamps: true,
});

// Ensure unique name per room
RoomMemberSchema.index({ roomId: 1, name: 1 }, { unique: true });

const RoomMember = mongoose.model('RoomMember', RoomMemberSchema);

module.exports = { RoomMember };

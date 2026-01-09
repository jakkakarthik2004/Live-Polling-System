const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    socketId: { type: String },
    isOnline: { type: Boolean, default: false },
    isKicked: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = { Student };

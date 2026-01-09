const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    studentName: { type: String, required: true },
    optionIndex: { type: Number }, // Legacy
    selectedOptions: [{ type: Number }], // New
}, {
    timestamps: true,
});

// Compound index to prevent duplicate votes from the same student on the same poll
VoteSchema.index({ pollId: 1, studentName: 1 }, { unique: true });

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = { Vote };
const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [OptionSchema],
    correctOptionIndex: { type: Number, default: null }, // Legacy
    correctOptionIndices: [{ type: Number }], // New support for multiple correct
    type: { type: String, enum: ['single', 'multiple'], default: 'single' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    startedAt: { type: Date },
    duration: { type: Number, required: true, default: 60 },
    isActive: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = { Poll };

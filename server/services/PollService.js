const mongoose = require('mongoose');
const { Poll } = require("../models/Poll");
const { Vote } = require("../models/Vote");
const { RoomMember } = require("../models/RoomMember");

class PollService {
    async createPoll(roomId, question, options, duration, correctOptionIndex, type = 'single', correctOptionIndices = []) {
        const formattedOptions = options.map(text => ({ text, votes: 0 }));
        
        let indices = correctOptionIndices;
        if (type === 'single' && correctOptionIndex !== -1 && indices.length === 0) {
            indices = [correctOptionIndex];
        }

        const poll = await Poll.create({
            roomId: new mongoose.Types.ObjectId(roomId),
            question,
            options: formattedOptions,
            duration,
            correctOptionIndex: correctOptionIndex === -1 ? null : correctOptionIndex,
            correctOptionIndices: indices,
            type,
            isActive: false
        });
        return poll;
    }

    async startPoll(pollId, roomId) {
        const activePoll = await Poll.findOne({ roomId: new mongoose.Types.ObjectId(roomId), isActive: true });
        
        if (activePoll) {
             await this.endPoll(activePoll._id);
        }

        const poll = await Poll.findOne({ _id: new mongoose.Types.ObjectId(pollId), roomId: new mongoose.Types.ObjectId(roomId) });
        if (!poll) throw new Error('Poll not found');

        poll.isActive = true;
        poll.startedAt = new Date();
        await poll.save();
        return poll;
    }

    async vote(pollId, studentName, optionIndexOrArray) {
        const poll = await Poll.findById(pollId);
        if (!poll) throw new Error('Poll not found');
        if (!poll.isActive) throw new Error('Poll is not active');

        if (poll.startedAt) {
            const now = new Date();
            const elapsedSeconds = (now.getTime() - poll.startedAt.getTime()) / 1000;
            if (elapsedSeconds > poll.duration + 2) {
                throw new Error('Poll has ended');
            }
        }

        const existingVote = await Vote.findOne({ pollId: poll._id, studentName });
        if (existingVote) {
             throw new Error('You have already voted');
        }

        let selectedOptions = [];
        if (Array.isArray(optionIndexOrArray)) {
            selectedOptions = optionIndexOrArray.map(Number);
        } else {
            selectedOptions = [Number(optionIndexOrArray)];
        }

        await Vote.create({ 
            pollId: poll._id, 
            studentName, 
            optionIndex: selectedOptions[0],
            selectedOptions 
        });

        for (const idx of selectedOptions) {
            if (poll.options[idx]) {
                poll.options[idx].votes += 1;
            }
        }
        await poll.save();

        return poll;
    }

    async endPoll(pollId) {
        try {
            const poll = await Poll.findById(pollId);
            if (!poll) throw new Error('Poll not found');

            if (!poll.isActive) {
                 return poll;
            }

            poll.isActive = false;
            await poll.save();

            const hasCorrectAnswers = poll.correctOptionIndices && poll.correctOptionIndices.length > 0;
            
            if (hasCorrectAnswers) {
                 const votes = await Vote.find({ pollId: poll._id });

                 const correctSet = new Set(poll.correctOptionIndices.map(String));

                 for (const vote of votes) {
                     const voteOptions = vote.selectedOptions && vote.selectedOptions.length > 0 
                        ? vote.selectedOptions 
                        : [vote.optionIndex];
                     
                     if (voteOptions.length === correctSet.size) {
                         const isMatch = voteOptions.every(opt => correctSet.has(String(opt)));
                         if (isMatch) {
                             await RoomMember.updateOne(
                                 { roomId: poll.roomId, name: vote.studentName },
                                 { $inc: { score: 1 } }
                             );
                         }
                     }
                 }
            }

            return poll;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getActivePoll(roomId) {
        let query = { isActive: true };
        try {
            query.roomId = new mongoose.Types.ObjectId(roomId);
        } catch (e) {
            return null;
        }

        const poll = await Poll.findOne(query);
        if (poll) {
             const now = new Date();
             const startedAt = poll.startedAt || new Date();
             const endTime = new Date(startedAt.getTime() + (poll.duration * 1000));
             if (now > endTime) {
                 await this.endPoll(poll._id);
                 return null;
             }
             return poll;
        }
        return poll;
    }

    async getPollsByRoom(roomId) {
        return await Poll.find({ roomId: new mongoose.Types.ObjectId(roomId) }).sort({ createdAt: -1 });
    }

    async getLatestPoll(roomId) {
        const poll = await Poll.findOne({ roomId: new mongoose.Types.ObjectId(roomId) }).sort({ createdAt: -1 });
        
        if (poll && poll.isActive) {
             const now = new Date();
             const startedAt = poll.startedAt || new Date();
             const endTime = new Date(startedAt.getTime() + (poll.duration * 1000));
             
             if (now > endTime) {
                 await this.endPoll(poll._id);
                 poll.isActive = false; 
             }
        }
        return poll;
    }

    async getPollDetails(pollId) {
        const poll = await Poll.findById(pollId);
        if (!poll) throw new Error('Poll not found');

        const votes = await Vote.find({ pollId: poll._id }).sort({ createdAt: -1 });
        
        const enrichedVotes = await Promise.all(votes.map(async (vote) => {
            const student = await RoomMember.findOne({ roomId: poll.roomId, name: vote.studentName });
            return {
                ...vote.toObject(),
                studentStatus: {
                    isKicked: false, 
                    isOnline: student?.isOnline || false
                }
            };
        }));

        return { poll, votes: enrichedVotes };
    }
}

const pollService = new PollService();
module.exports = { pollService };

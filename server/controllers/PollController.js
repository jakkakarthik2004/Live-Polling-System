const { pollService } = require('../services/PollService');

const createPoll = async (req, res) => {
    try {
        const { question, options, duration } = req.body;
        const poll = await pollService.createPoll(question, options, duration);
        res.status(201).json(poll);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPolls = async (req, res) => {
    try {
        const { roomId } = req.query;
        let polls;
        if (roomId) {
            polls = await pollService.getPollsByRoom(roomId);
        } else {
            polls = []; 
        }
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPollDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await pollService.getPollDetails(id);
        res.json(data);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getActivePoll = async (req, res) => {
    try {
        const { roomId } = req.params;
        const poll = await pollService.getActivePoll(roomId);
        res.json(poll); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLatestPoll = async (req, res) => {
    try {
        const { roomId } = req.params;
        const poll = await pollService.getLatestPoll(roomId);
        res.json(poll); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPoll,
    getPolls,
    getPollDetails,
    getActivePoll,
    getLatestPoll
};

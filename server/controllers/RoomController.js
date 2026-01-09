const { roomService } = require('../services/RoomService');

const getRoomLeaderboard = async (req, res) => {
    try {
        const { roomId } = req.params;
        const leaderboard = await roomService.getLeaderboard(roomId);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRoomLeaderboard };

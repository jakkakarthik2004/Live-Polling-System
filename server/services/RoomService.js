const { Room } = require("../models/Room");
const { RoomMember } = require("../models/RoomMember");

const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

class RoomService {
    async createRoom(teacherSocketId) {
        let roomCode;
        let exists = true;
        
        // Ensure uniqueness
        while (exists) {
            roomCode = generateRoomCode();
            const existingRoom = await Room.findOne({ roomCode });
            if (!existingRoom) exists = false;
        }

        const room = await Room.create({
            roomCode,
            createdBy: teacherSocketId
        });

        return room;
    }

    async getRoomByCode(roomCode) {
        return await Room.findOne({ roomCode, isActive: true });
    }

    async joinRoom(roomCode, name, socketId) {
        const room = await this.getRoomByCode(roomCode);
        if (!room) throw new Error("Invalid Room Code");

        // Check if name taken
        const existingMember = await RoomMember.findOne({ roomId: room._id, name });
        
        let member;
        if (existingMember) {
            if (existingMember.isOnline && existingMember.socketId !== socketId) {
                 throw new Error("Name already taken by an active user");
            }
            // Rejoin logic
            existingMember.socketId = socketId;
            existingMember.isOnline = true;
            await existingMember.save();
            member = existingMember;
        } else {
             member = await RoomMember.create({
                 roomId: room._id,
                 name,
                 socketId,
                 score: 0
             });
        }
        
        return { room, member };
    }

    async setMemberOffline(socketId) {
        await RoomMember.findOneAndUpdate({ socketId }, { isOnline: false });
    }

    async getLeaderboard(roomId) {
        return await RoomMember.find({ roomId })
            .sort({ score: -1 })
            .select('name score isOnline');
    }

    async getRoomMembers(roomId) {
        return await RoomMember.find({ roomId, isOnline: true }).select('name socketId');
    }

    async incrementScore(roomId, name) {
        await RoomMember.updateOne(
            { roomId, name }, 
            { $inc: { score: 1 } }
        );
    }

    async closeRoom(roomId) {
        // Mark room as inactive
        await Room.findByIdAndUpdate(roomId, { isActive: false });
        // Optionally mark all members offline or active polls inactive?
        // For now, just room status is enough for join logic, but polls might need cleanup.
        // Let's just update room.
    }
}

const roomService = new RoomService();
module.exports = { roomService };

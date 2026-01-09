const { pollService } = require("../services/PollService");
const { roomService } = require("../services/RoomService");

const registerSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        
        const broadcastRoomMembers = async (roomId) => {
             const members = await roomService.getRoomMembers(roomId);
             io.to(roomId.toString()).emit('room_members_update', members);
        };

        const broadcastLeaderboard = async (roomId) => {
             const leaderboard = await roomService.getLeaderboard(roomId);
             io.to(roomId.toString()).emit('leaderboard_update', leaderboard);
        };
        
        socket.on('rejoin_room_teacher', async ({ roomId }) => {
            try {
                if (!roomId) return;
                socket.join(roomId);
                
                const poll = await pollService.getLatestPoll(roomId);
                
                if (poll) {
                    socket.emit('poll_update', poll);
                }
                
                const leaderboard = await roomService.getLeaderboard(roomId);
                socket.emit('leaderboard_update', leaderboard);
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('create_room', async () => {
            try {
                const room = await roomService.createRoom(socket.id);
                socket.join(room._id.toString());
                socket.emit('room_created', room);
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('join_room', async ({ roomCode, name }) => {
            try {
                const { room, member } = await roomService.joinRoom(roomCode, name, socket.id);
                const roomId = room._id.toString();
                
                socket.join(roomId);
                socket.emit('room_joined', { room, member });
                
                await broadcastLeaderboard(roomId);
                await broadcastRoomMembers(roomId);

                const currentPoll = await pollService.getActivePoll(roomId);
                if (currentPoll) {
                    socket.emit('poll_update', currentPoll);
                }
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('create_poll', async (data) => {
            try {
                const { roomId, question, options, duration, correctOptionIndex, type, correctOptionIndices } = data;
                
                const poll = await pollService.createPoll(roomId, question, options, duration, correctOptionIndex, type, correctOptionIndices);
                const startedPoll = await pollService.startPoll(poll._id, roomId);
                
                io.to(roomId).emit('poll_started', startedPoll);

                setTimeout(async () => {
                    try {
                        const endedPoll = await pollService.endPoll(startedPoll._id);
                        if (!endedPoll.isActive) {
                             io.to(roomId).emit('poll_ended', endedPoll);
                             await broadcastLeaderboard(roomId);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }, duration * 1000);

            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('end_poll', async ({ pollId, roomId }) => {
            try {
                const poll = await pollService.endPoll(pollId);
                io.to(roomId).emit('poll_ended', poll);
                await broadcastLeaderboard(roomId);
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('kick_student', async ({ socketId, roomId }) => {
             try {
                await roomService.setMemberOffline(socketId);
                io.to(socketId).emit('kicked');
                
                if (roomId) {
                     await broadcastRoomMembers(roomId);
                     await broadcastLeaderboard(roomId);
                }
             } catch(err) {
                 console.error(err);
             }
        });

        socket.on('close_room', async ({ roomId }) => {
            try {
                await roomService.closeRoom(roomId);
                io.to(roomId).emit('room_closed');
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('get_room_members', async ({ roomId }) => {
             if (roomId) {
                 const members = await roomService.getRoomMembers(roomId);
                 socket.emit('room_members_update', members);
             }
        });

        socket.on('submit_vote', async ({ pollId, optionIndex, studentName, roomId }) => {
            try {
                const updatedPoll = await pollService.vote(pollId, studentName, optionIndex);
                io.to(roomId).emit('poll_update', updatedPoll); 
                io.to(roomId).emit('user_voted');
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('chat_message', ({ roomId, message, sender }) => {
            if (roomId) {
                io.to(roomId).emit('chat_message', { message, sender, id: Date.now(), timestamp: new Date() });
            }
        });

        socket.on('disconnect', async () => {
            await roomService.setMemberOffline(socket.id);
        });
    });
};

module.exports = { registerSocketHandlers };

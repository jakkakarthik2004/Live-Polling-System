import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useStudentLogic = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    
    const [roomContext, setRoomContext] = useState(null);
    const [activePoll, setActivePoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isKicked, setIsKicked] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('room_context');
        if (stored) {
            setRoomContext(JSON.parse(stored));
        } else {
            navigate('/join');
        }
    }, [navigate]);

    useEffect(() => {
        if (!socket || !roomContext) return;

        if (socket.connected) {
             socket.emit('join_room', { roomCode: roomContext.roomCode, name: roomContext.name });
        }
        
        socket.on('connect', () => {
             socket.emit('join_room', { roomCode: roomContext.roomCode, name: roomContext.name });
        });

        socket.on('poll_update', (poll) => {
            setActivePoll(poll);
        });

        socket.on('poll_started', (poll) => {
            setActivePoll(poll);
            setHasVoted(false);
        });

        socket.on('poll_ended', (poll) => {
            setActivePoll(poll); 
        });
        
        socket.on('leaderboard_update', (data) => {
             setLeaderboard(data);
        });

        socket.on('kicked', () => {
            setIsKicked(true);
            sessionStorage.removeItem('room_context');
            socket.disconnect();
        });

        socket.on('room_closed', () => {
            toast.error('Session Ended by Teacher', {
                duration: 3000,
                icon: '🛑',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            setTimeout(() => {
                sessionStorage.removeItem('room_context');
                navigate('/');
            }, 2000);
        });

        return () => {
            socket.off('connect');
            socket.off('poll_update');
            socket.off('poll_started');
            socket.off('poll_ended');
            socket.off('leaderboard_update');
            socket.off('kicked');
        };
    }, [socket, roomContext]);

    const vote = (selection) => {
        if (!activePoll || hasVoted || !roomContext) return;
        
        setHasVoted(true);
        sessionStorage.setItem(`voted_${activePoll._id}`, 'true');

        socket?.emit('submit_vote', {
            pollId: activePoll._id,
            studentName: roomContext.name,
            optionIndex: selection,
            roomId: roomContext.roomId
        });
    };
    
    useEffect(() => {
        if (activePoll) {
             const hasVotedStored = sessionStorage.getItem(`voted_${activePoll._id}`);
             if (hasVotedStored) {
                 setHasVoted(true);
             }
        }
    }, [activePoll]);

    return {
        roomContext,
        activePoll,
        hasVoted,
        vote,
        isKicked,
        leaderboard
    };
};

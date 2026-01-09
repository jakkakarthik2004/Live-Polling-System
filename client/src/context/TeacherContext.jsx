import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

export const TeacherContext = createContext(null);

export const TeacherProvider = ({ children }) => {
    const socket = useSocket();
    const [activePoll, setActivePoll] = useState(null);
    const [room, setRoom] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [history, setHistory] = useState([]);
    const [creationError, setCreationError] = useState(null);

    const fetchHistory = useCallback(async () => {
        if (!room?._id) return; 

        try {
            const res = await fetch(`http://54.144.33.173:5000/api/polls?roomId=${room._id}`);
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error(err);
        }
    }, [room?._id]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // 1. Initial Session Restore
    useEffect(() => {
        const storedRoom = sessionStorage.getItem('teacher_room');
        if (storedRoom) {
            const parsed = JSON.parse(storedRoom);
            setRoom(parsed);
             // Initial fetch for restored room
            fetch(`http://54.144.33.173:5000/api/polls/last/${parsed._id}?t=${Date.now()}`, { cache: "no-store" })
                .then(res => res.json())
                .then(poll => {
                    if (poll) setActivePoll(poll);
                })
                .catch(err => console.error(err));

            fetch(`http://54.144.33.173:5000/api/rooms/${parsed._id}/leaderboard`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setLeaderboard(data);
                })
                .catch(err => console.error(err));
        }
    }, []);

    // 2. Persistent Reconnection Handler
    useEffect(() => {
        if (!socket || !room) return;

        const handleRejoin = () => {
            console.log("Socket reconnected, rejoining room:", room._id);
            socket.emit('rejoin_room_teacher', { roomId: room._id });
        };

        socket.on('connect', handleRejoin);
        
        // If we are already connected but maybe lost state (or just mounted), ensure we are in.
        // However, we don't want to double-join on every render.
        // But for 'initial restore' (where socket might be connected before setRoom), we need to trigger it.
        if (socket.connected) {
             // We can safely emit this idempotent event
             // But let's only do it if we suspect we might not be joined?
             // Actually, doing it once when 'room' changes (and socket is valid) is good practice
             // to ensure we are sync with server.
             socket.emit('rejoin_room_teacher', { roomId: room._id });
        }

        return () => {
            socket.off('connect', handleRejoin);
        };
    }, [socket, room?._id]);

    useEffect(() => {
        if (room) {
            sessionStorage.setItem('teacher_room', JSON.stringify(room));
        } else {
            sessionStorage.removeItem('teacher_room');
        }
    }, [room]);

    const fetchHistoryRef = useRef(fetchHistory);
    useEffect(() => {
        fetchHistoryRef.current = fetchHistory;
    }, [fetchHistory]);

    useEffect(() => {
        if (!socket) return;

        socket.on('room_created', (newRoom) => {
            setRoom(newRoom);
            setActivePoll(null); 
            setLeaderboard([]);  
            toast.success("Room Created!");
        });

        socket.on('poll_update', (poll) => {
            setActivePoll(poll);
        });

        socket.on('poll_started', (poll) => {
            setActivePoll(poll);
            fetchHistoryRef.current();
        });

        socket.on('poll_ended', (poll) => {
            setActivePoll(prev => {
                return { ...poll, isActive: false };
            }); 
            fetchHistoryRef.current();
        });

        socket.on('leaderboard_update', (data) => {
            setLeaderboard(data);
        });

        socket.on('error', ({ message }) => {
            if (message === 'A poll is already active.' || message.includes('already active')) {
                toast.error('⚠️ A poll is already active! Please wait for it to end.', {
                    duration: 4000,
                    icon: '⏳'
                });
            } else {
                toast.error(message);
            }
            setCreationError(message);
        });

        return () => {
            socket.off('room_created');
            socket.off('poll_update');
            socket.off('poll_started');
            socket.off('poll_ended');
            socket.off('leaderboard_update');
            socket.off('error');
        };
    }, [socket]); 

    const createRoom = () => {
        socket?.emit('create_room');
    };

    const createPoll = async (question, options, duration, correctOptionIndex, type = 'single', correctOptionIndices = []) => {
        try {
            setCreationError(null);

            if (!room) {
                 toast.error("Please create a room first!");
                 return;
            }

            if (activePoll && activePoll.isActive) {
                toast.error('⚠️ A poll is already active!');
                setCreationError("A poll is already active!");
                return;
            }

            if (!socket) {
                toast.error("Connection lost. Please wait...");
                return;
            }

            socket.emit('create_poll', {
                roomId: room._id,
                question,
                options,
                duration,
                correctOptionIndex,
                type,
                correctOptionIndices
            });

        } catch (err) {
            setCreationError(err.message);
        }
    };
    
    const resetActivePoll = useCallback(() => {
        setActivePoll(null);
    }, []);

    const endRoom = () => {
        if (room && socket) {
            socket.emit('close_room', { roomId: room._id });
            setRoom(null);
            setActivePoll(null); 
            setLeaderboard([]);  
        }
    };

    const value = {
        room,
        activePoll,
        leaderboard,
        history,
        createRoom,
        createPoll,
        resetActivePoll,
        endRoom,
        creationError
    };

    return (
        <TeacherContext.Provider value={value}>
            {children}
        </TeacherContext.Provider>
    );
};

export const useTeacherContext = () => { 
    return useContext(TeacherContext); 
};

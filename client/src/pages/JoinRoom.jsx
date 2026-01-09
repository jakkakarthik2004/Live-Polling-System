import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import QrScanner from '../components/QrScanner';

const JoinRoom = () => {
    const { roomId: paramRoomId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const socket = useSocket();

    const [roomCode, setRoomCode] = useState(paramRoomId || '');
    const [name, setName] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        if (paramRoomId) setRoomCode(paramRoomId);
    }, [paramRoomId]);

    useEffect(() => {
        if (!socket) return;
        socket.on('room_joined', ({ room, member }) => {
            sessionStorage.setItem('room_context', JSON.stringify({
                roomId: room._id,
                roomCode: room.roomCode,
                memberId: member._id,
                name: member.name
            }));
            navigate('/student');
        });
        socket.on('error', ({ message }) => {
            setIsJoining(false);
            toast.error(message);
        });
        return () => {
            socket.off('room_joined');
            socket.off('error');
        };
    }, [socket, navigate]);

    const handleJoin = (e) => {
        if (e) e.preventDefault();
        if (!roomCode || !name) {
            toast.error("Please enter both Room Code and Name");
            return;
        }
        setIsJoining(true);
        if (socket.disconnected) socket.connect();
        socket.emit('join_room', { roomCode, name });
    };

    const handleQrScan = (data) => {
        let code = data;
        try {
            const url = new URL(data);
            const pathParts = url.pathname.split('/');
            const codeIndex = pathParts.indexOf('join') + 1;
            if (codeIndex > 0 && pathParts[codeIndex]) {
                code = pathParts[codeIndex];
            }
        } catch (e) {
        }

        setRoomCode(code.toUpperCase());
        setShowScanner(false);
        toast.success("Room Code Scanned!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark to-purple-900 flex items-center justify-center p-4">
            {showScanner && <QrScanner onScan={handleQrScan} onClose={() => setShowScanner(false)} />}
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl"
            >
                <div className="text-center mb-8 relative">
                    <button 
                        onClick={() => navigate('/')}
                        className="absolute left-0 top-1 p-2 -ml-4 text-gray hover:text-primary transition-colors hover:bg-gray/10 rounded-full"
                        title="Back to Home"
                    >
                        <span className="text-xl font-bold">←</span>
                    </button>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                        Join Session
                    </h1>
                    <p className="text-gray text-sm">Enter the code shown by your teacher.</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray uppercase mb-1 ml-1">Room Code</label>
                        <input 
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="w-full bg-light border-2 border-transparent focus:border-primary rounded-xl px-4 py-3 text-2xl font-mono text-center tracking-widest uppercase transition-all outline-none"
                            placeholder="CODE"
                            maxLength={6}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray uppercase mb-1 ml-1">Your Name</label>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-light border-2 border-transparent focus:border-primary rounded-xl px-4 py-3 text-lg font-bold text-center outline-none transition-all"
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={() => setShowScanner(true)}
                            className="bg-light text-dark font-bold py-3 rounded-xl hover:bg-gray/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📷</span> Scan QR
                        </button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isJoining}
                            className="bg-gradient-to-r from-primary to-secondary text-white font-black py-3 rounded-xl shadow-lg shadow-primary/30 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isJoining ? 'Joining...' : 'Enter'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


export default JoinRoom;

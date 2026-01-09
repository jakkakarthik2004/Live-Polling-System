import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const StudentList = ({ roomId }) => {
    const socket = useSocket();
    const [students, setStudents] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!socket || !roomId) return;
        
        socket.emit('get_room_members', { roomId });
        
        const handleUpdate = (list) => {
            setStudents(list);
        };
        
        socket.on('room_members_update', handleUpdate);
        return () => { socket.off('room_members_update', handleUpdate); };
    }, [socket, roomId]);

    const kickStudent = (socketId, studentName) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-semibold text-sm">Kick <span className="text-red-500">{studentName}</span>?</span>
                <div className="flex gap-2 mt-1">
                    <button 
                         onClick={() => {
                             socket?.emit('kick_student', { socketId, roomId });
                             toast.dismiss(t.id);
                             toast.success(`Kicked ${studentName}`);
                         }}
                         className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600"
                    >
                        Yes, Kick
                    </button>
                    <button 
                         onClick={() => toast.dismiss(t.id)}
                         className="bg-gray/20 text-dark px-3 py-1 rounded text-xs font-bold hover:bg-gray/30"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            icon: '⛔',
            style: {
                borderRadius: '10px',
                background: '#fff',
                color: '#333',
                border: '1px solid #eee',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        });
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 left-4 bg-dark text-white px-6 py-3 rounded-full shadow-lg z-40 hover:bg-black transition-all flex items-center gap-2 font-bold pointer-events-auto"
            >
                Users <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{students.length}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="fixed bottom-20 left-4 w-72 bg-white rounded-xl shadow-2xl border border-gray/20 p-4 z-40 max-h-[60vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-dark text-lg">Online Students</h3>
                             <button onClick={() => setIsOpen(false)} className="text-gray hover:text-dark">✕</button>
                        </div>
                        
                        {students.length === 0 ? (
                            <p className="text-sm text-gray text-center py-4">No active students.</p>
                        ) : (
                            <ul className="space-y-2">
                                {students.map(s => (
                                    <li key={s.socketId} className="flex justify-between items-center bg-light p-2 rounded-lg group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="font-semibold text-dark truncate max-w-[140px]" title={s.name}>{s.name}</span>
                                        </div>
                                        <button 
                                            onClick={() => kickStudent(s.socketId, s.name)}
                                            className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 font-bold"
                                        >
                                            KICK
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StudentList;

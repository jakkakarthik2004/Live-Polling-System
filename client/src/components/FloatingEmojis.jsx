import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['👍', '🔥', '🚀', '💡', '💯', '⭐', '🎉'];

const FloatingEmojis = () => {
    const socket = useSocket();
    const [emojis, setEmojis] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handleVote = () => {
             const count = Math.floor(Math.random() * 3) + 1;
             
             for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
                    const id = Date.now() + Math.random();
                    const x = Math.random() * 80 + 10;
       
                    setEmojis(prev => [...prev, { id, emoji, x }]);
       
                    setTimeout(() => {
                        setEmojis(prev => prev.filter(e => e.id !== id));
                    }, 2000);
                }, i * 200);
             }
        };

        socket.on('user_voted', handleVote);
        return () => { socket.off('user_voted', handleVote); };
    }, [socket]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {emojis.map(e => (
                    <motion.div
                        key={e.id}
                        initial={{ opacity: 0, y: window.innerHeight, x: `${e.x}vw`, scale: 0.5 }} 
                        animate={{ opacity: 1, y: window.innerHeight * 0.2, scale: 1.5 }}
                        exit={{ opacity: 0, y: 0, scale: 0.5 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute text-5xl"
                        style={{ left: 0 }}
                    >
                        {e.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FloatingEmojis;

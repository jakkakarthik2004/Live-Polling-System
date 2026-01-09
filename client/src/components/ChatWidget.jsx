import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = ({ userName, roomId }) => {
    const socket = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        if (!socket) return;
        const handleMsg = (msg) => {
            setMessages(prev => [...prev, msg]);
            if (!isOpen) setUnread(prev => prev + 1);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        };
        socket.on('chat_message', handleMsg);
        return () => { socket.off('chat_message', handleMsg); };
    }, [socket, isOpen]);

    useEffect(() => {
        if (isOpen) setUnread(0);
    }, [isOpen]);

    const send = (e) => {
        e.preventDefault();
        if (!input.trim() || !roomId) return;
        socket?.emit('chat_message', { roomId, message: input, sender: userName });
        setInput('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-auto">
             <AnimatePresence>
                 {isOpen && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray/20 flex flex-col overflow-hidden mb-2"
                     >
                         <div className="bg-primary p-4 text-white font-bold flex justify-between items-center shadow-sm">
                             <div className="flex items-center gap-2">
                                <span>💬 Live Chat</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-normal">{messages.length}</span>
                             </div>
                             <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">✕</button>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-light/50 custom-scrollbar">
                             {messages.length === 0 && (
                                 <p className="text-center text-gray text-xs mt-10">Start the conversation!</p>
                             )}
                             {messages.map(m => (
                                 <div key={m.id} className={`flex flex-col ${m.sender === userName ? 'items-end' : 'items-start'}`}>
                                     <span className="text-[10px] text-gray mb-1 px-1">{m.sender} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                     <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] shadow-sm ${
                                         m.sender === userName ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray/10 rounded-bl-none text-dark'
                                     }`}>
                                         {m.message}
                                     </div>
                                 </div>
                             ))}
                             <div ref={messagesEndRef} />
                         </div>
                         <form onSubmit={send} className="p-3 bg-white border-t border-gray/10 flex gap-2">
                             <input 
                                className="flex-1 bg-light rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-dark"
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                             />
                             <button type="submit" className="bg-primary text-white p-2 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm" disabled={!input.trim()}>
                                 ➤
                             </button>
                         </form>
                     </motion.div>
                 )}
             </AnimatePresence>
             
             <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative"
             >
                 <span className="text-2xl">💬</span>
                 {unread > 0 && (
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                         {unread}
                     </span>
                 )}
             </button>
        </div>
    );
};

export default ChatWidget;

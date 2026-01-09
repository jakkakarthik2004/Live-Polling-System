import { motion, AnimatePresence } from 'framer-motion';
import QRCodeDisplay from './QRCodeDisplay';

const InviteStudentModal = ({ roomCode, isOpen, onClose }) => {
    if (!isOpen) return null;

    const joinLink = `${window.location.origin}/join/${roomCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(joinLink);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative z-10"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray hover:text-dark p-2"
                    >
                        ✕
                    </button>

                    <div className="text-center">
                        <h2 className="text-3xl font-black text-dark mb-2">Invite Students</h2>
                        <p className="text-gray mb-8">Scan the QR code or share the link below</p>

                        <div className="bg-light p-6 rounded-2xl inline-block mb-8 shadow-inner">
                            <QRCodeDisplay value={joinLink} size={250} />
                        </div>

                        <div className="flex items-center gap-4 bg-light p-2 pr-2 pl-4 rounded-xl border border-gray/10">
                            <span className="flex-1 font-mono text-lg text-primary truncate text-left">
                                {joinLink}
                            </span>
                            <button 
                                onClick={handleCopy}
                                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            >
                                Copy
                            </button>
                        </div>
                        
                        <div className="mt-8 flex justify-center gap-8">
                             <div className="text-center">
                                 <div className="text-4xl font-black text-dark font-mono bg-light px-4 py-2 rounded-xl border border-gray/10">
                                     {roomCode}
                                 </div>
                                 <p className="text-xs font-bold text-gray uppercase mt-2">Room Code</p>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InviteStudentModal;

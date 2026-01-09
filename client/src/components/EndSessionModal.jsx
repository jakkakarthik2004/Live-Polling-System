import { motion, AnimatePresence } from 'framer-motion';

const EndSessionModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray/10 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
             
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🛑
             </div>

             <h2 className="text-2xl font-black text-dark mb-2">End Session?</h2>
             <p className="text-gray mb-8 text-sm leading-relaxed">
                This will close the room for all students and download the final report. This action cannot be undone.
             </p>

             <div className="flex gap-3">
                 <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-bold bg-light text-gray hover:bg-gray/10 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-transform active:scale-95"
                 >
                    End Room
                 </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EndSessionModal;

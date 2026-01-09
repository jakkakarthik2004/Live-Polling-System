import { useState } from 'react';
import { useZxing } from "react-zxing";
import { motion, AnimatePresence } from 'framer-motion';

const QrScanner = ({ onScan, onClose }) => {
    const { ref } = useZxing({
        onDecodeResult: (result) => {
            onScan(result.getText());
        },
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-md bg-dark rounded-2xl overflow-hidden"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-white bg-black/50 p-2 rounded-full backdrop-blur-md"
                    >
                        ✕
                    </button>
                    
                    <div className="aspect-[3/4] relative">
                         <video ref={ref} className="w-full h-full object-cover" />
                         
                         <div className="absolute inset-0 border-[40px] border-black/50 ml-auto mr-auto">
                              <div className="relative w-full h-full border-2 border-primary animate-pulse shadow-[0_0_20px_rgba(33,150,243,0.5)]">
                                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                              </div>
                         </div>
                    </div>

                    <div className="p-4 text-center text-white">
                        <p className="font-bold">Point camera at QR Code</p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QrScanner;

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FancyTimer = ({ timeLeft, totalDuration }) => {
  const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  const isLow = timeLeft <= 10 && timeLeft > 0;
  const audioRef = useRef(null);

  useEffect(() => {
    if (isLow) {
        if (!audioRef.current) {
            audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
            audioRef.current.volume = 0.5;
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log(e));
    }
  }, [timeLeft, isLow]);

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center gap-3">
      <motion.div 
        animate={isLow ? { scale: [1, 1.1, 1] } : {}}
        transition={isLow ? { repeat: Infinity, duration: 1 } : {}}
        className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shadow-sm
            ${isLow ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-primary border-gray/20'}
        `}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx="10"
                    cy="10"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="transparent"
                    className="text-gray/20"
                />
                <circle
                    cx="10"
                    cy="10"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-linear ${isLow ? 'text-red-500' : 'text-primary'}`}
                />
            </svg>
        </div>
        
        <span className="font-mono font-bold w-12 text-center text-lg">
            {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
        </span>
      </motion.div>
    </div>
  );
};

export default FancyTimer;

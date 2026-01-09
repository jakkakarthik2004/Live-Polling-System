import { usePollTimer } from '../hooks/usePollTimer';
import FancyTimer from './FancyTimer';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

const SOUND_SUCCESS = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
const SOUND_POP = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

const LivePoll = ({ poll, onVote, hasVoted, isStudent = false }) => {
  const timeLeft = usePollTimer(poll.startedAt, poll.duration);
  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
  const [playSuccess] = useSound(SOUND_SUCCESS);
  const [playPop] = useSound(SOUND_POP);

  useEffect(() => {
      if (!poll.isActive) {
          confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#7765DA', '#FFD700', '#FF6B6B']
          });
          playSuccess();
      }
  }, [poll.isActive, playSuccess]);

  useEffect(() => {
      if (totalVotes > 0) playPop();
  }, [totalVotes, playPop]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const isMultiSelect = poll.type === 'multiple';

  const showVoting = isStudent && timeLeft > 0 && !hasVoted;

  const handleVote = (index) => {
      if (isMultiSelect) {
          if (selectedOptions.includes(index)) {
              setSelectedOptions(selectedOptions.filter(i => i !== index));
          } else {
              setSelectedOptions([...selectedOptions, index]);
          }
      } else {
          setSelectedOptions([index]);
          onVote && onVote(index);
      }
  };

  const submitMultiVote = () => {
      if (selectedOptions.length > 0) {
          onVote && onVote(selectedOptions);
      }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray/20 max-w-3xl w-full">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-bold text-dark">Question</h2>
        <FancyTimer timeLeft={timeLeft} totalDuration={poll.duration} />
      </div>

      <div className="bg-dark text-white p-4 rounded-t-lg mb-1">
        <h3 className="font-medium">{poll.question}</h3>
      </div>
      
      {isMultiSelect && showVoting && (
          <div className="bg-blue-50 text-blue-600 text-xs px-4 py-2 mb-2 font-bold uppercase tracking-wide">
              Select all that apply
          </div>
      )}

      <div className="space-y-2">
        {poll.options.map((opt, idx) => {
           const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
           
           if (showVoting) {
             const isHighlighted = selectedOptions.includes(idx);
             
             return (
               <button 
                 key={idx}
                 onClick={() => handleVote(idx)}
                 className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 group border ${
                     isHighlighted 
                        ? 'bg-purple-50 border-purple-600 shadow-md ring-1 ring-purple-600' 
                        : 'bg-light hover:bg-primary/5 border-transparent hover:border-primary/30'
                 }`}
               >
                 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                     isHighlighted ? 'bg-purple-600 text-white' : 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white'
                 }`}>
                     {isHighlighted ? '✓' : idx + 1}
                 </span>
                 <span className={`font-medium ${isHighlighted ? 'text-purple-700 font-bold' : 'text-dark'}`}>{opt.text}</span>
               </button>
             );
           }

           return (
             <div key={idx} className="relative bg-light rounded-lg overflow-hidden h-12 flex items-center px-4">
               {!isStudent && (
                 <div 
                   className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-500 ease-out"
                   style={{ width: `${percentage}%` }}
                 />
               )}
               
               <div className="relative z-10 flex justify-between w-full items-center">
                 <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    <span className="text-dark font-medium">{opt.text}</span>
                 </div>
                 {!isStudent && <span className="font-bold text-dark">{percentage}%</span>}
               </div>
             </div>
           );
        })}
      </div>
      
      {showVoting && isMultiSelect && (
          <button 
            onClick={submitMultiVote}
            disabled={selectedOptions.length === 0}
            className="w-full mt-4 bg-secondary text-white py-3 rounded-lg font-bold shadow-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Submit Response
          </button>
      )}

      {!showVoting && isStudent && timeLeft > 0 && (
         <div className="mt-4 text-center text-gray text-sm">
             Vote submitted! Watching live results...
         </div>
      )}

      {!poll.isActive && (
          <div className="mt-4 text-center text-red-500 text-sm font-semibold">
              Poll Ended
          </div>
      )}
    </div>
  );
};

export default LivePoll;

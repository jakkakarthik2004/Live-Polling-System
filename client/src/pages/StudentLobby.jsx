import { motion } from 'framer-motion';
import { useStudentLogic } from '../hooks/useStudentLogic';
import LivePoll from '../components/LivePoll';
import FloatingEmojis from '../components/FloatingEmojis';
import ChatWidget from '../components/ChatWidget';
import Leaderboard from '../components/Leaderboard';

const StudentLobby = () => {
  const { roomContext, activePoll, vote, hasVoted, isKicked, leaderboard } = useStudentLogic();

  if (isKicked) {
      return (
          <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-red-100 text-center">
                  <div className="text-5xl mb-4">🚫</div>
                  <h1 className="text-2xl font-bold text-dark mb-2">Access Denied</h1>
                  <p className="text-gray mb-6">You have been removed from this session by the teacher.</p>
                  <button 
                    onClick={() => window.location.href = '/join'}
                    className="text-primary font-semibold hover:underline"
                  >
                    Try Rejoining
                  </button>
              </div>
          </div>
      );
  }

  if (!activePoll) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4 relative">
         <ChatWidget userName={roomContext?.name || 'Student'} roomId={roomContext?.roomId} />
         <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-8 inline-block animate-pulse">
            ✨ Intervue.io Poll
         </span>
         
         <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
         
         <h2 className="text-xl font-bold text-dark mb-2">Welcome, {roomContext?.name}!</h2>
         <p className="text-gray mb-8">Waiting for the teacher to ask a question...</p>
         
         {leaderboard.length > 0 && (
             <div className="w-full max-w-md animate-fade-in">
                 <Leaderboard leaderboard={leaderboard} />
             </div>
         )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-4 relative">
      <FloatingEmojis />
      <ChatWidget userName={roomContext?.name} roomId={roomContext?.roomId} />
      
      <header className="max-w-2xl mx-auto mb-6 md:mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
         <div className="flex items-center gap-2">
            <span className="bg-white shadow-sm text-dark text-xs px-3 py-1 rounded-full font-bold border border-gray/10">👤 {roomContext?.name}</span>
            <div className="bg-white shadow-sm px-3 py-1 rounded-full flex items-center gap-2 border border-gray/10">
                 <span className="text-xs font-bold text-gray uppercase">Room:</span>
                 <span className="text-xs font-black text-primary font-mono">{roomContext?.roomCode}</span>
            </div>
         </div>
      </header>

      <main className="max-w-2xl mx-auto space-y-6">
         <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray/10 animate-scale-in">
             <LivePoll poll={activePoll} onVote={vote} hasVoted={hasVoted} isStudent={true} />
         </div>
         
         {!activePoll.isActive && leaderboard.length > 0 && (
             <div className="animate-fade-in">
                 <Leaderboard leaderboard={leaderboard} />
             </div>
         )}
      </main>
    </div>
  );
};

export default StudentLobby;

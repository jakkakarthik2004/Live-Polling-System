import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherLogic } from '../hooks/useTeacherLogic';
import PollCreator from '../components/PollCreator';
import LivePoll from '../components/LivePoll';
import FloatingEmojis from '../components/FloatingEmojis';
import StudentList from '../components/StudentList';
import ChatWidget from '../components/ChatWidget';
import Leaderboard from '../components/Leaderboard';
import InviteStudentModal from '../components/InviteStudentModal';
import EndSessionModal from '../components/EndSessionModal';

const isPollEnded = (poll) => {
    if (!poll?.isActive) return true;
    if (!poll?.startedAt) return false;
    const endTime = new Date(poll.startedAt).getTime() + (poll.duration * 1000);
    const now = Date.now();
    return now >= endTime;
};

const TeacherDashboard = () => {
  const { activePoll, createPoll, creationError, room, createRoom, leaderboard, resetActivePoll, endRoom } = useTeacherLogic();
  
  const navigate = useNavigate();
  const [showInvite, setShowInvite] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
      if (activePoll?.isActive && activePoll?.startedAt) {
          const startTime = new Date(activePoll.startedAt).getTime();
          const durationMs = activePoll.duration * 1000;
          const endTime = startTime + durationMs;
          const now = Date.now();
          const msRemaining = endTime - now;
          
          if (msRemaining > 0) {
              const timer = setTimeout(() => {
                  setForceUpdate(n => n + 1);
              }, msRemaining + 1000); 
              return () => clearTimeout(timer);
          } else {
              setForceUpdate(n => n + 1);
          }
      }
  }, [activePoll]);

  return (
    <div className="min-h-screen bg-light p-8 relative">
      <ChatWidget userName="Teacher (Host)" roomId={room?._id} />
      <FloatingEmojis />
      <StudentList roomId={room?._id} />
      
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">Intervue.io Poll</span>
            {room && (
                <>
                    <div className="flex items-center gap-4 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray/10">
                        <span className="text-sm font-bold text-gray uppercase tracking-wider">Room Code:</span>
                        <span className="text-2xl font-black text-primary font-mono tracking-widest leading-none">{room.roomCode}</span>
                    </div>
                    <button 
                        onClick={() => setShowInvite(true)}
                        className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary/90 transition-transform hover:scale-105 shadow-md"
                    >
                        Invite Students 🔗
                    </button>
                    <InviteStudentModal 
                        isOpen={showInvite} 
                        onClose={() => setShowInvite(false)} 
                        roomCode={room.roomCode}
                    />
                </>
            )}
         </div>
         <button 
            onClick={() => navigate('/teacher/history')}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
         >
            View Poll history
         </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {!room ? (
             <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                  <h1 className="text-4xl font-black text-dark">Ready to start a session?</h1>
                  <p className="text-gray max-w-md">Create a room to generate a unique code and QR link for your students to join.</p>
                  <button 
                      onClick={createRoom}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform font-bold text-xl uppercase tracking-wide"
                  >
                      Create Live Room
                  </button>
             </div>
        ) : (
             <>
                <div className="lg:col-span-2 flex flex-col items-center">
                    {activePoll ? (
                      <div className="w-full animate-fade-in space-y-6">
                         <LivePoll poll={activePoll} />
                         {(!activePoll.isActive || isPollEnded(activePoll)) && (
                             <div className="grid grid-cols-2 gap-4">
                                 <button
                                     onClick={resetActivePoll}
                                     className="bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
                                 >
                                     Ask Next Question ➡️
                                 </button>
                                 <button
                                     onClick={() => setShowEndModal(true)}
                                     className="bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-red-600 transition-transform hover:scale-105"
                                 >
                                     End Room ⏹️
                                 </button>
                             </div>
                         )}
                         <EndSessionModal 
                            isOpen={showEndModal}
                            onClose={() => setShowEndModal(false)}
                            onConfirm={() => {
                                endRoom();
                                setShowEndModal(false);
                            }}
                         />
                      </div>
                    ) : (
                      <div className="w-full flex justify-center animate-slide-up">
                         <PollCreator createPoll={createPoll} error={creationError} />
                      </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Leaderboard leaderboard={leaderboard} />
                </div>
             </>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;

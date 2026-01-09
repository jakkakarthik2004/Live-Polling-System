import { useNavigate } from 'react-router-dom';
import { useTeacherLogic } from '../hooks/useTeacherLogic';

const PollHistory = () => {
  const { history } = useTeacherLogic();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-light p-8">
      <header className="max-w-4xl mx-auto mb-8">
         <button 
             onClick={() => navigate('/teacher')}
             className="text-gray hover:text-dark transition-colors mb-4 flex items-center gap-2"
         >
             ← Back to Dashboard
         </button>
         <h1 className="text-3xl font-bold text-dark">Poll History</h1>
         <p className="text-gray mt-1">Archive of all past polls</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {history.length === 0 ? (
              <p className="text-center text-gray py-10">No history available.</p>
          ) : (
              history.map((poll) => (
                <div 
                  key={poll._id} 
                  onClick={() => navigate(`/teacher/poll/${poll._id}`)}
                  className="bg-white p-4 rounded-lg border border-gray/10 shadow-sm flex justify-between items-center cursor-pointer hover:border-primary transition-all"
                >
                   <div>
                      <p className="font-semibold text-dark">{poll.question}</p>
                      <p className="text-xs text-gray">{new Date(poll.createdAt || '').toLocaleString()}</p>
                   </div>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Finished</span>
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PollHistory;

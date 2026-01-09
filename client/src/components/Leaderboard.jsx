import { useRef, useEffect } from 'react';

const Leaderboard = ({ leaderboard = [] }) => {
    const maxScore = Math.max(...leaderboard.map(u => u.score), 1);

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray/10 p-4 md:p-6">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4 flex items-center gap-2">
                <span>🏆</span> Live Leaderboard
            </h3>

            {leaderboard.length === 0 ? (
                <p className="text-gray text-sm text-center py-4 italic">Waiting for results...</p>
            ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {leaderboard.map((user, idx) => (
                        <div key={idx} className="relative">
                            <div className="flex items-center justify-between z-10 relative mb-1">
                                <span className="font-bold text-dark flex items-center gap-2">
                                    <span className="w-6 text-center text-sm">{getMedal(idx) || `#${idx + 1}`}</span>
                                    {user.name}
                                    {!user.isOnline && <span className="text-[10px] bg-gray/20 px-1 rounded text-gray font-normal">OFFLINE</span>}
                                </span>
                                <span className="font-bold text-primary">{user.score} pts</span>
                            </div>
                            <div className="h-2 w-full bg-light rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${(user.score / maxScore) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;

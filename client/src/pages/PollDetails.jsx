import { useParams, useNavigate } from 'react-router-dom';
import { usePollDetails } from '../hooks/usePollDetails';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

const PollDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, loading, error } = usePollDetails(id);

    // CSV Download Logic
    const downloadCSV = () => {
        if (!data?.votes || !data.poll) return;
        
        const csvData = data.votes.map((v) => ({
            Student: v.studentName,
            Status: v.studentStatus?.isKicked ? 'Kicked' : 'Active',
            Vote: data.poll.options[v.optionIndex]?.text || 'Unknown',
            Time: new Date(v.createdAt).toLocaleString()
        }));
    
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `poll_results_${data.poll._id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !data) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Poll not found'}</div>;

    const { poll, votes } = data;
    const totalVotes = votes.length;

    // Prepare data for Recharts
    const chartData = poll.options.map((opt, index) => ({
        name: opt.text.length > 15 ? opt.text.substring(0, 15) + '...' : opt.text,
        fullText: opt.text,
        votes: opt.votes,
        color: ['#7765DA', '#5767D0', '#4F0DCE', '#373737'][index % 4]
    }));

    return (
        <div className="min-h-screen bg-light p-8">
            <header className="max-w-6xl mx-auto mb-8">
                <button 
                    onClick={() => navigate('/teacher')}
                    className="text-gray hover:text-dark transition-colors mb-4 flex items-center gap-2"
                >
                    ← Back to Dashboard
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-dark">{poll.question}</h1>
                        <p className="text-gray mt-1">Total Votes: {totalVotes}</p>
                    </div>
                    <button 
                        onClick={downloadCSV}
                        className="bg-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
                    >
                        <span>⬇</span> Download CSV
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizations */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray/10"
                >
                    <h2 className="text-xl font-bold text-dark mb-6">Results Overview</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Student Responses List */}
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1 }}
                     className="bg-white p-6 rounded-xl shadow-sm border border-gray/10 flex flex-col h-[500px]"
                >
                    <h2 className="text-xl font-bold text-dark mb-6">Student Responses</h2>
                    <div className="overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar">
                        {votes.length === 0 ? (
                            <p className="text-gray text-center mt-10">No votes recorded yet.</p>
                        ) : (
                            votes.map((vote, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-light rounded-lg transition-colors border-b border-gray/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                            {vote.studentName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-dark">{vote.studentName}</span>
                                                {vote.studentStatus?.isKicked && (
                                                    <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                                        Kicked
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-gray">
                                                {new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray mr-2">voted for</span>
                                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                                            {poll.options[vote.optionIndex].text}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default PollDetails;

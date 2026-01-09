import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
          ✨ Intervue.io Poll
        </span>
        <h1 className="text-4xl font-bold text-dark mb-4">
          Welcome to the Live Polling System
        </h1>
        <p className="text-gray max-w-lg mx-auto">
          Please select the role that best describes you to begin using the live polling system
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <div 
          onClick={() => navigate('/student')}
          className="flex-1 bg-white p-6 md:p-8 rounded-xl border-2 border-transparent hover:border-primary cursor-pointer transition-all shadow-sm hover:shadow-md group"
        >
          <h2 className="text-xl font-bold text-dark mb-2 group-hover:text-primary">I'm a Student</h2>
          <p className="text-gray text-sm">
            Join active polls, vote instantly, and see real-time results.
          </p>
        </div>

        <div 
          onClick={() => navigate('/teacher')}
          className="flex-1 bg-white p-6 md:p-8 rounded-xl border-2 border-transparent hover:border-primary cursor-pointer transition-all shadow-sm hover:shadow-md group"
        >
          <h2 className="text-xl font-bold text-dark mb-2 group-hover:text-primary">I'm a Teacher</h2>
          <p className="text-gray text-sm">
            Create polls, manage live sessions, and track student engagement effortlessly.
          </p>
        </div>
      </div>

      <button 
        className="mt-12 bg-secondary text-white px-12 py-3 rounded-full font-semibold hover:bg-primary transition-colors"
        onClick={() => {}} 
      >
        Continue
      </button>
    </div>
  );
};

export default Landing;

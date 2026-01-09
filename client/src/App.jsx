import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Landing from './pages/Landing';
import JoinRoom from './pages/JoinRoom';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLobby from './pages/StudentLobby';
import PollDetails from './pages/PollDetails';
import PollHistory from './pages/PollHistory';

import { Toaster } from 'react-hot-toast';

import TeacherLayout from './components/TeacherLayout';

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/join/:roomId" element={<JoinRoom />} />
          
          <Route path="/teacher" element={<TeacherLayout />}>
             <Route index element={<TeacherDashboard />} />
             <Route path="history" element={<PollHistory />} />
             <Route path="poll/:id" element={<PollDetails />} />
          </Route>

          <Route path="/student" element={<StudentLobby />} />
        </Routes>
      </Router>
      <Toaster position="top-center" toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
      }}/>
    </SocketProvider>
  );
}

export default App;

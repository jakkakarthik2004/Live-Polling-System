import { Outlet } from 'react-router-dom';
import { TeacherProvider } from '../context/TeacherContext';

const TeacherLayout = () => {
  return (
    <TeacherProvider>
      <Outlet />
    </TeacherProvider>
  );
};

export default TeacherLayout;

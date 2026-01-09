import { useContext } from 'react';
import { TeacherContext } from '../context/TeacherContext';

export const useTeacherLogic = () => {
    return useContext(TeacherContext);
};

import { createContext, useContext, useState, useEffect } from "react";

const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem("teachers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  const addTeacher = (teacher) => setTeachers(prev => [...prev, { ...teacher, id: Date.now() }]);
  const updateTeacher = (id, updated) =>
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  const deleteTeacher = (id) =>
    setTeachers(prev => prev.filter(t => t.id !== id));

  return (
    <TeacherContext.Provider value={{ teachers, addTeacher, updateTeacher, deleteTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

// Custom hook
export const useTeacher = () => useContext(TeacherContext);
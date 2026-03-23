import { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const addStudent = (student) => setStudents(prev => [...prev, student]);
  const updateStudent = (id, updated) =>
    setStudents(prev => prev.map(s => s.id === id ? {...s, ...updated} : s));
  const deleteStudent = (id) =>
    setStudents(prev => prev.filter(s => s.id !== id));

  return (
    <StudentContext.Provider value={{ students, addStudent, updateStudent, deleteStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

// ✅ custom hook for consuming context
export const useStudent = () => useContext(StudentContext);
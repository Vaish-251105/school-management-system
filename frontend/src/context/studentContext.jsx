import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
       setLoading(true);
       const response = await api.get("/students");
       setStudents(Array.isArray(response.data) ? response.data : (response.data.students || []));
    } catch (err) {
       console.error("Student fetch error:", err);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async (student) => {
    try {
      await api.post("/students", student);
      fetchStudents();
    } catch (err) { alert("Error adding student: " + err.message); }
  };

  const updateStudent = async (id, updated) => {
    try {
      await api.put(`/students/${id}`, updated);
      fetchStudents();
    } catch (err) { alert("Error updating student"); }
  };

  const deleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) { alert("Error deleting student"); }
  };

  return (
    <StudentContext.Provider value={{ students, addStudent, updateStudent, deleteStudent, loading }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
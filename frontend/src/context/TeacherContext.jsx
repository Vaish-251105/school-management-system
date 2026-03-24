import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teachers");
      setTeachers(response.data || []);
    } catch (err) {
      console.error("Teacher fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const addTeacher = async (teacher) => {
    try {
       await api.post("/teachers", teacher);
       fetchTeachers();
    } catch (err) { alert("Error adding teacher: " + err.message); }
  };

  const updateTeacher = async (id, updated) => {
    try {
       await api.put(`/teachers/${id}`, updated);
       fetchTeachers();
    } catch (err) { alert("Error updating teacher"); }
  };

  const deleteTeacher = async (id) => {
    try {
       await api.delete(`/teachers/${id}`);
       fetchTeachers();
    } catch (err) { alert("Error deleting teacher"); }
  };

  return (
    <TeacherContext.Provider value={{ teachers, addTeacher, updateTeacher, deleteTeacher, loading }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => useContext(TeacherContext);
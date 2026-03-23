import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import Classes from "./pages/Classes";
import Staff from "./pages/Staff";
import Fees from "./pages/Fees";
import Accountant from "./pages/Accountant";
import Attendance from "./pages/Attendance";
import ExamResults from "./pages/ExamResults";
import Homework from "./pages/Homework";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";


function App() {

  return (

      <BrowserRouter>

        {/* GLOBAL UI WRAPPER */}
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">

          <Routes>

            {/* LOGIN */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* DASHBOARD LAYOUT - Wrap all private pages here */}
            <Route element={<DashboardLayout />}>
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="teacher-dashboard" element={<Dashboard />} />
              <Route path="parent-dashboard" element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="student-profile" element={<StudentProfile />} />
              <Route path="classes" element={<Classes />} />
              <Route path="staff" element={<Staff />} />
              <Route path="fees" element={<Fees />} />
              <Route path="accountant" element={<Accountant />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="exams" element={<ExamResults />} />
              <Route path="homework-notices" element={<Homework />} />
              <Route path="communication" element={<Communication />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
            </Route>

          </Routes>

        </div>

      </BrowserRouter>

  );
}

export default App;
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { FeesProvider } from "./context/FeesContext";
import { ClassProvider } from "./context/ClassContext";
import { TeacherProvider } from "./context/TeacherContext";
import { StudentProvider } from "./context/studentContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <FeesProvider>
      <StudentProvider>
        <TeacherProvider>
          <ClassProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ClassProvider>
        </TeacherProvider>
      </StudentProvider>
    </FeesProvider>

  </React.StrictMode>
);
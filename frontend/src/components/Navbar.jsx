import { User, LogIn, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="bg-white text-gray-800 flex items-center justify-between p-4 shadow">

      {/* Title */}
      <h1 className="text-xl font-bold">
        DASHBOARD PANEL
      </h1>

      <div className="flex items-center gap-4">

        {/* 🔍 Search */}
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />
        </div>

        {/* 👤 Profile (only if logged in) */}
        {user && (
          <button
            onClick={() => {
              if (user.role === "admin") {
                navigate("/admin-profile");
              } else {
                navigate("/student-profile");
              }
            }}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <User size={18} />
          </button>
        )}

        {/* 🔐 Auth Buttons */}
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              <LogIn size={16} />
              Login
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Register
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}

      </div>
    </div>
  );
}
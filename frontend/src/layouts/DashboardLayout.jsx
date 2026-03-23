import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "../components/Navbar"

export default function DashboardLayout() {

  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    if (!currentUser) {
      navigate("/login")
    } else {
      setUser(currentUser)
    }

  }, [navigate])

  const logout = () => {

    localStorage.removeItem("currentUser")
    navigate("/login")

  }

  return (
    <div className="flex min-h-screen">

  {/* Sidebar */}
  <Sidebar 
    isOpen={isOpen} 
    setIsOpen={setIsOpen} 
    role={user?.role}
  />

  {/* Main Section */}
  <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-all duration-300">

    <Navbar 
      setIsOpen={setIsOpen} 
      user={user}
      logout={logout}
    />

    <div className="p-6 text-gray-800 dark:text-gray-100">
      <Outlet />
    </div>

  </div>

</div>
  )
}
import React, { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import { Menu, X, Bell, User, GraduationCap, LayoutGrid, MessageSquare, CalendarDays } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading || !user) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <div className="p-8 bg-[#1e1b4b] rounded-[35px] shadow-3xl animate-bounce mb-10">
          <GraduationCap className="text-white w-12 h-12" />
       </div>
       <p className="text-[#1e1b4b] font-black text-[13px] uppercase tracking-[8px] animate-pulse">Initializing Portal Node...</p>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-sans selection:bg-[#4F46E5]/10 selection:text-[#4F46E5] overflow-x-hidden">
      
      {/* PERSISTENT SIDEBAR - EXACT FLUTTER MATCH */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* MAIN VIEWPORT */}
      <div className={`flex-1 transition-all duration-700 ease-in-out relative flex flex-col`}>
        
        {/* MOBILE FLOATING HEADER - GHOST STYLE */}
        <div className={`fixed top-0 right-0 w-full z-[100] transition-all duration-500 lg:hidden px-6 py-4 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
            <div className="flex justify-between items-center max-w-7xl mx-auto">
               <button 
                 onClick={() => setIsOpen(true)}
                 className="bg-[#1e1b4b] p-3 rounded-xl shadow-lg border border-white/5 hover:bg-black transition text-white active:scale-90"
               >
                  <Menu className="w-5 h-5" />
               </button>
               <div className="flex items-center gap-3">
                  <div className="bg-[#1e1b4b] p-2.5 rounded-xl">
                     <GraduationCap className="text-white w-4 h-4" />
                  </div>
                  <h4 className="text-[#1e1b4b] font-black text-[10px] uppercase tracking-[3px] italic leading-none">Smart School ERP</h4>
               </div>
               <button className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition text-[#1e1b4b] active:scale-95">
                  <Bell className="w-5 h-5" />
               </button>
            </div>
        </div>

        {/* DESKTOP SIDEBAR TOGGLE - FLOATING GHOST */}
        <div className="fixed top-12 left-84 z-[100] hidden lg:block">
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-3xl border border-gray-100 hover:bg-[#1e1b4b] hover:text-white transition-all active:scale-95 opacity-0 hover:opacity-100 duration-300"
           >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>

        <div className="flex-1 w-full relative z-10 transition-all duration-700">
           <Outlet />
        </div>

        {/* BOTTOM NAV BAR - MOBILE ONLY (OPTIONAL FOR PURE MOBILE FEEL) */}
        <div className="fixed bottom-0 left-0 w-full lg:hidden bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-[100] flex justify-between items-center px-10 animate-in slide-in-from-bottom">
           <NavIcon icon={<LayoutGrid />} active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')} />
           <NavIcon icon={<MessageSquare />} active={location.pathname === '/communication'} onClick={() => navigate('/communication')} />
           <div className="bg-blue-600 p-5 rounded-[24px] -mt-12 border-4 border-gray-50 text-white shadow-xl active:scale-90 transition-transform cursor-pointer" onClick={() => setIsOpen(true)}>
              <Menu className="w-7 h-7" />
           </div>
           <NavIcon icon={<CalendarDays />} active={location.pathname === '/calendar'} onClick={() => navigate('/calendar')} />
           <NavIcon icon={<User />} active={location.pathname === '/profile'} onClick={() => navigate('/profile')} />
        </div>

      </div>
    </div>
  )
}

function NavIcon({ icon, active, onClick }) {
   return (
      <button 
        onClick={onClick}
        className={`p-3 rounded-xl transition-all duration-500 relative ${active ? 'bg-blue-600 text-white shadow-lg active:scale-95' : 'text-gray-300 hover:text-blue-600'}`}>
         {React.cloneElement(icon, { size: 20 })}
         {active && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white"></div>}
      </button>
   )
}
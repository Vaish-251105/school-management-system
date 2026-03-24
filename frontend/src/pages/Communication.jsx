import React, { useState, useEffect } from "react";
import { 
  Check, 
  MessageSquare, 
  User,
  Megaphone,
  MessageCircle,
  Clock,
  Plus,
  ChevronLeft,
  Loader2,
  Send,
  Inbox,
  SendHorizontal,
  Mail,
  X,
  UserCheck,
  Search,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Communication() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("notices"); // notices, messages
  const [notices, setNotices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New message form
  const [msgRecipient, setMsgRecipient] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    fetchHubData();
  }, [activeTab]);

  const fetchHubData = async () => {
    try {
      setLoading(true);
      if (activeTab === "notices") {
        const nRes = await api.get("/notices");
        setNotices(Array.isArray(nRes.data) ? nRes.data : []);
      } else {
        const [inRes, sentRes, recRes] = await Promise.all([
          api.get("/messages/inbox"),
          api.get("/messages/sent"),
          api.get("/teachers/recipients")
        ]);
        setMessages(Array.isArray(inRes.data?.messages) ? inRes.data.messages : []);
        setSentMessages(Array.isArray(sentRes.data?.messages) ? sentRes.data.messages : []);
        setRecipients(Array.isArray(recRes.data) ? recRes.data : []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgRecipient || !msgSubject || !msgContent) return alert("Please fill all fields");
    setSubmitting(true);
    try {
      await api.post("/messages", {
        recipient: msgRecipient,
        subject: msgSubject,
        message: msgContent
      });
      setComposeOpen(false);
      setMsgSubject("");
      setMsgContent("");
      alert("Message sent successfully!");
      fetchHubData();
    } catch (err) {
      alert("Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !composeOpen) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase tracking-[4px]">Syncing Hub...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans pb-32 transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4f46e5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex justify-between items-center text-white">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-1">Internal Network</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Communication</h1>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="max-w-6xl mx-auto mt-12 relative z-10 flex bg-white/5 backdrop-blur-md rounded-[40px] p-2 border border-white/10 w-fit">
           <TabBtn active={activeTab === 'notices'} label="Announcements" icon={<Megaphone />} onClick={() => setActiveTab('notices')} />
           <TabBtn active={activeTab === 'messages'} label="Direct Messenger" icon={<MessageCircle />} onClick={() => setActiveTab('messages')} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mt-12 w-full flex-1">

        {activeTab === "notices" ? (
          <div className="animate-in fade-in transition-all">
             <div className="flex justify-between items-end mb-10">
                <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Latest Notices</h3>
                <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest leading-none">Live Updates</span>
                </div>
             </div>

             <div className="space-y-8">
               {notices.length > 0 ? notices.map((n, idx) => (
                  <NoticeCard key={n._id || idx} idx={idx} n={n} />
               )) : (
                 <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[60px] flex flex-col items-center">
                   <Mail className="w-16 h-16 text-gray-200 mb-6" />
                   <p className="text-gray-400 font-black italic uppercase text-lg">No active notices found</p>
                 </div>
               )}
             </div>
          </div>
        ) : (
          <div className="animate-in fade-in transition-all">
             {/* MESSAGING INTERFACE */}
             <div className="flex flex-col md:flex-row gap-12">
                
                {/* INBOX */}
                <div className="flex-1 space-y-8">
                   <SectionTitle label="Received Messages" icon={<Inbox className="w-5 h-5" />} count={messages.length} />
                   {messages.map((m, i) => <MessageItem key={m._id || i} idx={i} m={m} type="inbox" />)}
                   {messages.length === 0 && <EmptyState label="Inbox is empty" />}
                </div>

                {/* SENT */}
                <div className="flex-1 space-y-8">
                   <SectionTitle label="Sent History" icon={<SendHorizontal className="w-5 h-5" />} count={sentMessages.length} />
                   {sentMessages.map((m, i) => <MessageItem key={m._id || i} idx={i} m={m} type="sent" />)}
                   {sentMessages.length === 0 && <EmptyState label="No sent messages" />}
                </div>
             </div>
          </div>
        )}
      </div>

      {activeTab === 'messages' && (
        <div className="fixed bottom-10 right-10 z-[100]">
          <button 
            onClick={() => setComposeOpen(true)}
            className="bg-[#4f46e5] text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/20 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-sm uppercase tracking-widest border border-white/10 group">
            <Plus className="w-7 h-7 text-indigo-300 group-hover:rotate-90 transition-transform" /> Compose Thread
          </button>
        </div>
      )}

      {/* COMPOSE MODAL */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in zoom-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[60px] shadow-3xl overflow-hidden text-black transition-all">
              <div className="bg-[#1e1b4b] p-10 flex justify-between items-center text-white">
                 <div className="flex items-center gap-6">
                    <div className="bg-[#4f46e5] p-5 rounded-[28px] border border-white/10 shadow-xl">
                       <Send className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Compose Message</h2>
                       <p className="text-white/40 text-[10px] font-black mt-2 uppercase tracking-[3px]">Internal Session</p>
                    </div>
                 </div>
                 <button onClick={() => setComposeOpen(false)} className="bg-white/10 p-5 rounded-[30px] hover:bg-black transition active:scale-90 border border-white/5">
                    <X className="w-7 h-7" />
                 </button>
              </div>

              <form onSubmit={handleSendMessage} className="p-12 space-y-8 bg-white">
                 <div className="space-y-3">
                    <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 px-1">
                       <User className="w-4 h-4" /> Message Recipient
                    </label>
                    <select 
                       value={msgRecipient}
                       onChange={(e) => setMsgRecipient(e.target.value)}
                       className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[28px] outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all font-bold text-lg"
                       required
                    >
                       <option value="">Select a specific recipient...</option>
                       {recipients.map(r => (
                          <option key={r._id} value={r._id}>{r.name} ({r.role || 'Staff'})</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 px-1">
                       <BookOpen className="w-4 h-4" /> Subject Line
                    </label>
                    <input 
                       type="text"
                       placeholder="Enter message subject..."
                       value={msgSubject}
                       onChange={(e) => setMsgSubject(e.target.value)}
                       className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[28px] outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all font-bold text-lg"
                       required
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 px-1">
                       <MessageSquare className="w-4 h-4" /> Description
                    </label>
                    <textarea 
                       placeholder="Type your secure message content here..."
                       rows="6"
                       value={msgContent}
                       onChange={(e) => setMsgContent(e.target.value)}
                       className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[35px] outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all font-bold text-lg resize-none"
                    />
                 </div>

                 <button 
                   type="submit" 
                   disabled={submitting}
                   className="w-full bg-[#1e1b4b] text-white py-6 rounded-[35px] font-black uppercase tracking-widest text-sm shadow-3xl hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                   {submitting ? <Loader2 className="animate-spin w-7 h-7" /> : <Send className="w-7 h-7 text-indigo-300" />}
                   Execute Send
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}

function TabBtn({ active, label, icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`px-10 py-5 rounded-[32px] font-black text-[13px] uppercase tracking-widest transition-all flex items-center gap-4 ${
         active ? "bg-white text-[#4f46e5] shadow-2xl scale-105" : "text-white/40 hover:text-white"
      }`}
    >
       {React.cloneElement(icon, { size: 18 })} {label}
    </button>
  );
}

function SectionTitle({ label, icon, count }) {
   return (
      <div className="flex justify-between items-center px-4">
         <div className="flex items-center gap-4 text-black">
            <div className="p-3 bg-indigo-50 rounded-2xl text-[#4f46e5]">{icon}</div>
            <h4 className="font-black text-xl uppercase tracking-tight">{label}</h4>
         </div>
         <span className="bg-gray-100 text-gray-400 font-black text-[10px] px-4 py-1.5 rounded-full">{count}</span>
      </div>
   );
}

function NoticeCard({ idx, n }) {
   return (
     <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm flex items-start gap-10 hover:shadow-2xl transition-all group animate-in slide-in-from-bottom" style={{ animationDelay: `${idx * 100}ms` }}>
        <div className="bg-indigo-50 p-6 rounded-[32px] group-hover:bg-[#4f46e5] transition-colors shadow-inner shrink-0 scale-110">
           <Megaphone className="text-[#4f46e5] group-hover:text-white w-8 h-8" />
        </div>
        <div>
           <div className="flex justify-between items-center mb-4">
              <span className="bg-indigo-100 text-[#4f46e5] font-black text-[10px] uppercase tracking-[3px] px-4 py-1.5 rounded-xl">Global Alert</span>
              <span className="text-gray-300 font-bold text-[11px] uppercase italic tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</span>
           </div>
           <h4 className="text-black font-black text-3xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{n.title}</h4>
           <p className="text-gray-400 font-bold text-lg mt-4 leading-relaxed italic">{n.content}</p>
        </div>
     </div>
   );
}

function MessageItem({ idx, m, type }) {
   const partner = type === 'inbox' ? m.sender : m.recipient;
   const name = partner?.name || "System Member";
   const subject = m.subject || "No Subject";
   const init = name.split(' ').map(x => x[0]).join('').toUpperCase();

   return (
     <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center group hover:shadow-2xl transition-all duration-300 animate-in fade-in cursor-pointer">
        <div className="w-16 h-16 rounded-[24px] bg-[#1e1b4b] text-white font-black text-xl flex items-center justify-center border-4 border-white shadow-xl shrink-0 group-hover:rotate-12 transition-transform">
           {init}
        </div>
        <div className="ml-8 flex-1 min-w-0">
           <div className="flex justify-between items-center mb-1">
              <h4 className="text-black font-black text-lg tracking-tight uppercase truncate">{name}</h4>
              <span className="text-gray-300 text-[9px] font-black uppercase tracking-widest">{new Date(m.createdAt).toLocaleDateString()}</span>
           </div>
           <p className="text-[#4f46e5] font-black text-[11px] uppercase tracking-widest mb-1 truncate">{subject}</p>
           <p className="text-gray-400 font-bold text-sm leading-none truncate opacity-60">Session thread active</p>
        </div>
     </div>
   );
}

function EmptyState({ label }) {
   return (
     <div className="p-20 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
        <Mail className="w-12 h-12 text-gray-200 mb-6" />
        <p className="text-gray-400 font-black italic uppercase text-sm tracking-widest">{label}</p>
     </div>
   );
}
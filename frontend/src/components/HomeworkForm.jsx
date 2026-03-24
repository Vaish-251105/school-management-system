import React, { useState } from "react";
import { Send, Book, Type, FileText, CalendarDays } from "lucide-react";

export default function HomeworkForm({ addHomework }) {
  const [data, setData] = useState({
    title: "",
    subject: "",
    class: "10-A",
    description: "",
    dueDate: ""
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.title || !data.subject || !data.description || !data.dueDate) {
      alert("Please fill all fields to assign homework.");
      return;
    }
    // Transform class to required format if needed by backend
    addHomework(data);
    setData({ title: "", subject: "", class: "10-A", description: "", dueDate: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
           <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
           <input
             name="title"
             required
             placeholder="Assignment Title (e.g. Calculus Set 1)"
             value={data.title}
             onChange={handleChange}
             className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-[14px]"
           />
        </div>

        <div className="relative group">
           <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
           <input
             name="subject"
             required
             placeholder="Subject (e.g. Mathematics)"
             value={data.subject}
             onChange={handleChange}
             className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-[14px]"
           />
        </div>
      </div>

      <div className="relative group">
         <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
         <textarea
           name="description"
           required
           placeholder="Homework Instructions & Details..."
           value={data.description}
           onChange={handleChange}
           className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-[14px] h-24 resize-none"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
           <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
           <input
             name="dueDate"
             required
             type="date"
             value={data.dueDate}
             onChange={handleChange}
             className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-[14px]"
           />
        </div>

        <button className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:bg-indigo-600 transition active:scale-95 whitespace-nowrap">
          <Send className="w-4 h-4" /> Broadcast Task
        </button>
      </div>

    </form>
  )
}
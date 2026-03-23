import React from "react";
import { 
  ChevronLeft, 
  MoreVertical,
  TrendingUp,
  Check,
  Bell,
  CheckCircle2,
  Download,
  Banknote,
  BarChart,
  ArrowRight,
  Plus
} from "lucide-react";

export default function Fees() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-28">
      
      {/* HEADER AREA */}
      <div className="bg-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-lg font-bold">Fees & Payments</h1>
            <button 
              onClick={() => alert("Settings for Fees module coming soon")}
              className="text-white p-2 hover:bg-white/10 rounded-full transition">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="border border-white/20 bg-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-[12px]">Total Collection</p>
                <h2 className="text-white text-[28px] font-bold tracking-tight">$42,500.00</h2>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <TrendingUp className="text-white w-3 h-3" />
                <span className="text-white font-bold text-[11px]">+12.5%</span>
              </div>
            </div>

            <hr className="border-white/20 my-4" />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-[11px]">Received</p>
                <h3 className="text-white text-[16px] font-bold">$38,200</h3>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div>
                <p className="text-white/80 text-[11px]">Pending</p>
                <h3 className="text-white text-[16px] font-bold">$4,300</h3>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* CHIPS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-[#4f46e5] border border-[#4f46e5] text-white font-bold px-4 py-2 rounded-full text-[13px] shrink-0 shadow-sm flex items-center gap-1.5">
            <Check className="w-4 h-4" /> All Fees
          </button>
          <button className="bg-white text-gray-700 font-medium px-5 py-2 rounded-full text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 transition">
            Tuition
          </button>
          <button className="bg-white text-gray-700 font-medium px-5 py-2 rounded-full text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 transition">
            Transport
          </button>
          <button className="bg-white text-gray-700 font-medium px-5 py-2 rounded-full text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 transition">
            Examination
          </button>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Recent Transactions</h3>
          <button className="text-[#4f46e5] font-medium text-[13px]">See All</button>
        </div>

        <div className="space-y-4 mb-4">
          <FeeCard title="Tuition Fee - Grade 10-A" subtitle="Student: Alex Johnson" date="Oct 15, 2023" amount="$1,200.00" status="Paid" hasPay={false} />
          <FeeCard title="Bus Fee - Route 04" subtitle="Student: Sarah Williams" date="Oct 20, 2023" amount="$150.00" status="Pending" hasPay={true} />
        </div>

        {/* SECTION HEADER */}
        <div className="flex items-center gap-3 pt-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[#4f46e5] font-bold text-xs">SW</div>
          <h3 className="text-gray-900 font-bold text-[16px]">Sarah Williams's Fees</h3>
        </div>

        <div className="space-y-4 mb-4">
          <FeeCard title="Quarterly Tuition" subtitle="Term 2 (2023-24)" date="Nov 05, 2023" amount="$850.00" status="Pending" hasPay={true} />
          <FeeCard title="Lab & Library Charges" subtitle="Annual 2023" date="Sep 10, 2023" amount="$200.00" status="Paid" hasPay={false} />
          <FeeCard title="Sports Kit Fee" subtitle="One-time payment" date="Aug 15, 2023" amount="$75.00" status="Overdue" hasPay={true} />
        </div>

        {/* FINANCIAL INSIGHTS */}
        <div className="mt-8 bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-3xl shadow-sm flex items-center mb-6">
          <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center shadow-md">
            <BarChart className="text-white w-5 h-5" />
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-gray-900 font-bold text-[15px]">Financial Insights</h4>
            <p className="text-gray-500 text-[12px] mt-0.5">Your monthly revenue report is ready.</p>
          </div>
          <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-[#4f46e5]">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => alert("Opening Fee Collection Form...")}
          className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-600 transition">
          <Plus className="w-5 h-5" /> Collect Fee
        </button>
      </div>

    </div>
  );
}

function FeeCard({ title, subtitle, date, amount, status, hasPay }) {
  
  let badgeClasses = "bg-transparent text-gray-800";
  if (status === "Paid") badgeClasses = "bg-green-50 text-green-700";
  if (status === "Pending") badgeClasses = "text-gray-800"; // looks regular text in design

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[16px] leading-tight">{title}</h4>
          <p className="text-gray-400 text-[12px] mt-1">{subtitle}</p>
        </div>
        <div className={`${badgeClasses} font-bold text-[10px] px-2.5 py-1 rounded-full`}>
          {status}
        </div>
      </div>

      <hr className="border-gray-100 mb-4" />

      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-gray-400 text-[11px]">Due Date</p>
          <p className="text-gray-800 text-[15px] font-medium mt-0.5">{date}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-[11px]">Amount</p>
          <p className="text-[#4f46e5] text-[18px] font-bold tracking-tight">{amount}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button className="bg-indigo-50 text-[#4f46e5] py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition">
          <Bell className="w-3.5 h-3.5" /> Send Reminder
        </button>
        <button className="bg-[#4f46e5] text-white py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-indigo-600 transition">
          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="bg-white border text-gray-500 border-gray-200 py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition">
          <Download className="w-3.5 h-3.5" /> Receipt
        </button>
        {hasPay && (
          <button className="bg-[#2d5a27] text-white py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-green-900 transition">
            <Banknote className="w-3.5 h-3.5" /> Pay Now
          </button>
        )}
      </div>

    </div>
  );
}
import { Book, User } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Activity, Shield, Users, Database, Zap, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface AdminDashboardProps {
  books: Book[];
  users: User[];
}

export default function AdminDashboard({ books, users }: AdminDashboardProps) {
  // Statistics calculations
  const stats = [
    { label: "Total Books", value: books.length, icon: Database, color: "text-brand-blue" },
    { label: "Active Users", value: users.length, icon: Users, color: "text-indigo-500" },
    { label: "Loan Rate", value: `${Math.round((books.filter(b => b.status === "Borrowed").length / books.length) * 100 || 0)}%`, icon: Activity, color: "text-emerald-500" },
    { label: "Weekly Growth", value: "+12.4%", icon: TrendingUp, color: "text-blue-400" },
  ];

  // Genre distribution data
  const genres = [...new Set(books.map(b => b.genre))];
  const genreData = genres.map(genre => ({
    name: genre,
    count: books.filter(b => b.genre === genre).length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // Status distribution data
  const statusData = [
    { name: "Available", value: books.filter(b => b.status === "Available").length },
    { name: "Borrowed", value: books.filter(b => b.status === "Borrowed").length },
    { name: "Reserved", value: books.filter(b => b.status === "Reserved").length },
  ];

  const COLORS = ["#3B82F6", "#64748B", "#94A3B8"];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-space font-bold text-3xl uppercase tracking-tighter mb-2 text-slate-900">Admin <span className="text-brand-blue">Analytics</span></h2>
          <p className="text-slate-500 font-medium">Real-time inventory insights and system performance tracking.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-brand-blue/30 bg-blue-50 transition-all rounded-lg">
          <Activity size={16} className="text-brand-blue" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">Library Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-brand-blue transition-colors group-hover:text-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp size={14} className="text-slate-200 group-hover:text-brand-blue transition-colors" />
            </div>
            <div className="font-space font-bold text-4xl mb-1 text-slate-800">{stat.value}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Classification Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
           <h3 className="font-space font-bold text-xl uppercase tracking-widest mb-8 flex items-center gap-3 text-slate-800">
             <Shield size={20} className="text-brand-blue" />
             Category Distribution
           </h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={genreData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                 <XAxis 
                   dataKey="name" 
                   stroke="#94a3b8" 
                   fontSize={10} 
                   tickFormatter={(val) => val.toUpperCase()}
                   axisLine={false}
                   tickLine={false}
                   dy={10}
                 />
                 <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                   cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                 />
                 <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40}>
                   {genreData.map((_, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? "#3B82F6" : "#cbd5e1"} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Inventory Status Chart */}
        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
          <h3 className="font-space font-bold text-xl uppercase tracking-widest mb-8 flex items-center gap-3 text-slate-800">
            <Activity size={20} className="text-brand-blue" />
            Inventory Status
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{entry.name}</span>
                </div>
                <span className="font-space font-bold text-slate-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

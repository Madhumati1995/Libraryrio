import { Book, UserRole } from "../types";
import { Edit2, Trash2, BookOpen, Clock, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface BookCardProps {
  key?: string;
  book: Book;
  role: UserRole;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
  variant?: "card" | "row";
}

export default function BookCard({ book, role, onEdit, onDelete, onView, variant = "card" }: BookCardProps) {
  const canManage = role === "Employee" || role === "Admin";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "text-emerald-500 border-emerald-500 bg-emerald-50";
      case "Borrowed": return "text-brand-blue border-brand-blue bg-blue-50";
      case "Reserved": return "text-amber-500 border-amber-500 bg-amber-50";
      default: return "text-slate-400 border-slate-200 bg-slate-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available": return <BookOpen size={14} />;
      case "Borrowed": return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (variant === "row") {
    return (
      <motion.div 
        whileHover={{ x: 10 }}
        className="group relative bg-white border border-slate-100 hover:border-brand-blue transition-all duration-300 flex overflow-hidden rounded-xl shadow-sm hover:shadow-xl"
      >
        <div 
          className="w-32 md:w-48 aspect-[3/4] overflow-hidden shrink-0 cursor-pointer"
          onClick={() => onView(book)}
        >
          <img 
            src={book.cover} 
            alt={book.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <div className="p-6 flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{book.genre}</div>
              <h3 className="font-space font-bold text-2xl uppercase tracking-tighter group-hover:text-brand-blue transition-colors text-slate-800">{book.title}</h3>
            </div>
            <div className={`px-2 py-1 border rounded text-[10px] font-bold uppercase flex items-center gap-1 ${getStatusColor(book.status)}`}>
              {getStatusIcon(book.status)}
              {book.status}
            </div>
          </div>
          <p className="text-slate-500 font-medium mb-6">{book.author} — {book.year}</p>
          <div className="flex gap-4">
            <button 
              onClick={() => onView(book)}
              className="px-6 py-2 bg-brand-blue text-white font-bold uppercase text-[10px] tracking-widest hover:bg-brand-dark transition-all rounded-lg"
            >
              Details
            </button>
            {canManage && (
              <>
                <button 
                  onClick={() => onEdit(book)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 hover:text-brand-blue hover:border-brand-blue font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 rounded-lg"
                >
                  <Edit2 size={12} />
                  Update
                </button>
                <button 
                  onClick={() => onDelete(book.id)}
                  className="px-6 py-2 border border-rose-100 text-rose-500 hover:text-white hover:bg-rose-500 font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 rounded-lg"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white border border-slate-100 hover:border-brand-blue transition-all duration-300 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl"
    >
      <div 
        className="aspect-[3/4] overflow-hidden relative cursor-pointer"
        onClick={() => onView(book)}
      >
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-4 right-4 backdrop-blur-md border px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${getStatusColor(book.status)}`}>
          {getStatusIcon(book.status)}
          {book.status}
        </div>
      </div>

      <div className="p-6">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{book.genre}</div>
        <h3 className="font-space font-bold text-xl uppercase tracking-tighter line-clamp-1 mb-1 text-slate-800">{book.title}</h3>
        <p className="text-slate-500 text-sm font-medium mb-4">{book.author} — {book.year}</p>

        <div className="flex items-center justify-between mt-auto">
          {canManage ? (
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => onEdit(book)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-white text-slate-600 hover:text-brand-blue border border-slate-200 py-2.5 px-3 transition-all text-xs font-bold uppercase tracking-tighter rounded-lg"
              >
                <Edit2 size={14} />
                Update
              </button>
              <button 
                onClick={() => onDelete(book.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-100 py-2.5 px-3 transition-all text-xs font-bold uppercase tracking-tighter rounded-lg"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onView(book)}
              className="w-full bg-slate-50 hover:bg-brand-blue text-slate-800 hover:text-white border border-slate-200 hover:border-brand-blue py-3 px-3 transition-all text-sm font-bold uppercase tracking-tighter rounded-xl"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

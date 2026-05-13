import { Book, UserRole } from "../types";
import { X, BookOpen, Clock, AlertCircle, Calendar, Hash, Tag, Trash2, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookDetailsModalProps {
  isOpen: boolean;
  book: Book | null;
  role: UserRole;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function BookDetailsModal({ isOpen, book, role, onEdit, onDelete, onClose }: BookDetailsModalProps) {
  if (!isOpen || !book) return null;

  const canManage = role === "Employee" || role === "Admin";

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Available": return { color: "text-emerald-500", icon: <BookOpen size={16} />, label: "Available" };
      case "Borrowed": return { color: "text-brand-blue", icon: <Clock size={16} />, label: "Borrowed" };
      case "Reserved": return { color: "text-amber-500", icon: <AlertCircle size={16} />, label: "Reserved" };
      default: return { color: "text-slate-500", icon: <AlertCircle size={16} />, label: status };
    }
  };

  const statusInfo = getStatusInfo(book.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-3xl"
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-10 text-slate-400 hover:text-slate-600 transition-colors bg-white/80 p-2 rounded-full backdrop-blur-md shadow-sm border border-slate-100"
          >
            <X size={24} />
          </button>

          <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto overflow-hidden">
            <img 
              src={book.cover} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12 w-full md:w-3/5 flex flex-col justify-center bg-white">
            <div className="inline-flex items-center gap-2 bg-brand-light text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6 w-fit border border-brand-blue/10">
              <span>{book.genre}</span>
            </div>

            <h2 className="font-space font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-4 text-slate-900">
              {book.title}
            </h2>

            <p className="text-xl text-slate-500 font-medium mb-8 border-l-4 border-brand-blue pl-4">
              Written by {book.author}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-brand-blue" />
                  Publication Year
                </div>
                <div className="text-xl font-space font-bold text-slate-800">{book.year}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Hash size={12} className="text-brand-blue" />
                  Catalog ID
                </div>
                <div className="text-xl font-space font-bold text-brand-blue">{book.id.toUpperCase()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Tag size={12} className="text-brand-blue" />
                  Category
                </div>
                <div className="text-xl font-space font-bold text-slate-800">{book.genre}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className={`${statusInfo.color}`}>{statusInfo.icon}</span>
                  Status
                </div>
                <div className={`text-xl font-space font-bold ${statusInfo.color}`}>{statusInfo.label}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onClose}
                className="flex-1 min-w-[140px] bg-slate-100 text-slate-600 font-space font-bold uppercase py-4 rounded-xl hover:bg-slate-200 transition-all"
              >
                Close Details
              </button>
              
              {book.status === "Available" && !canManage && (
                <button 
                  className="flex-1 min-w-[140px] bg-brand-blue text-white font-space font-bold uppercase py-4 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand-blue/20"
                >
                  Borrow Book
                </button>
              )}

              {canManage && (
                <>
                  <button 
                    onClick={() => onEdit(book)}
                    className="flex-1 min-w-[140px] bg-blue-50 text-brand-blue border border-blue-100 font-space font-bold uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-white"
                  >
                    <Edit3 size={18} />
                    <span>Edit Record</span>
                  </button>
                  <button 
                    onClick={() => onDelete(book.id)}
                    className="flex-1 min-w-[140px] bg-rose-50 text-rose-500 border border-rose-100 font-space font-bold uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                    <span>Delete Entry</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

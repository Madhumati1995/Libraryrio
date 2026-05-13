import { Book } from "../types";
import { Edit2, Trash2, Plus, ArrowUpRight, Search } from "lucide-react";
import { motion } from "motion/react";

interface EmployeePortalProps {
  books: Book[];
  onAdd: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
}

export default function EmployeePortal({ books, onAdd, onEdit, onDelete, onView }: EmployeePortalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Borrowed": return "text-brand-blue bg-blue-50 border-blue-100";
      default: return "text-amber-600 bg-amber-50 border-amber-100";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-space font-bold text-3xl uppercase tracking-tighter mb-2 text-slate-900">Inventory <span className="text-brand-blue">Management</span></h2>
          <p className="text-slate-500 font-medium">Manage library resources and catalog information updates.</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-brand-blue text-white hover:bg-brand-dark px-8 py-4 font-space font-bold uppercase text-sm tracking-widest transition-all flex items-center gap-2 group rounded-xl shadow-lg shadow-brand-blue/20"
        >
          <Plus size={18} />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Book Information</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Author / Publisher</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Genre</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((book) => (
                <motion.tr 
                  key={book.id}
                  whileHover={{ backgroundColor: "rgb(248, 250, 252)" }}
                  className="group transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={book.cover} className="w-10 h-14 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                      <div>
                        <div className="font-space font-bold uppercase text-sm group-hover:text-brand-blue transition-colors text-slate-800">{book.title}</div>
                        <div className="text-xs text-slate-400">Released: {book.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue/80">{book.genre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 border rounded text-[10px] font-bold uppercase ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => onView(book)}
                        className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                        title="View Details"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(book)}
                        className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                        title="Edit Book"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(book.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

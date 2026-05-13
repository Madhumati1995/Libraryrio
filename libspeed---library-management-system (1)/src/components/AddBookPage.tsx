import { useState } from "react";
import { Book, BookStatus } from "../types";
import { Save, ArrowLeft, Database } from "lucide-react";
import { motion } from "motion/react";

interface AddBookPageProps {
  onSave: (book: Partial<Book>) => void;
  onCancel: () => void;
  editingBook?: Book | null;
}

export default function AddBookPage({ onSave, onCancel, editingBook }: AddBookPageProps) {
  const [formData, setFormData] = useState<Partial<Book>>(
    editingBook || {
      title: "",
      author: "",
      genre: "",
      year: "",
      status: "Available",
      cover: ""
    }
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-12 flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Inventory
        </button>
        <div className="flex items-center gap-2 text-brand-blue">
          <Database size={20} />
          <span className="font-space font-bold uppercase tracking-widest text-sm">Secure Catalog</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-8 md:p-12 relative overflow-hidden rounded-3xl shadow-xl">
        <div className="relative">
          <div className="mb-10">
            <h2 className="font-space font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-2 text-slate-900">
              {editingBook ? "Edit" : "New"} <span className="text-brand-blue">Record</span>
            </h2>
            <p className="text-slate-500 font-medium">Enter detailed information for the new library resource.</p>
          </div>

          <form 
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              onSave(formData);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block ml-1">Book Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue px-5 py-4 outline-none transition-all font-medium text-lg placeholder:text-slate-300 rounded-xl"
                  placeholder="e.g. Great Expectations"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block ml-1">Author Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue px-5 py-4 outline-none transition-all font-medium text-lg placeholder:text-slate-300 rounded-xl"
                  placeholder="Author's name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block ml-1">Genre / Category</label>
                <input 
                  required
                  type="text" 
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue px-5 py-4 outline-none transition-all font-medium text-lg placeholder:text-slate-300 rounded-xl"
                  placeholder="e.g. Classic, Sci-Fi"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block ml-1">Publication Year</label>
                <input 
                  required
                  type="text" 
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue px-5 py-4 outline-none transition-all font-medium text-lg placeholder:text-slate-300 rounded-xl"
                  placeholder="2026"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block ml-1">Cover Image URL</label>
              <input 
                required
                type="url" 
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue px-5 py-4 outline-none transition-all font-medium text-lg placeholder:text-slate-300 rounded-xl"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block ml-1">Availability Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue px-5 py-4 outline-none transition-all font-medium text-lg appearance-none cursor-pointer rounded-xl"
              >
                <option value="Available">Available for Loan</option>
                <option value="Borrowed">Currently Borrowed</option>
                <option value="Reserved">On Hold / Reserved</option>
              </select>
            </div>

            <div className="pt-10">
              <button 
                type="submit"
                className="group w-full flex items-center justify-center gap-4 bg-brand-blue hover:bg-brand-dark text-white py-5 font-space font-bold uppercase tracking-[0.3em] transition-all duration-300 rounded-xl shadow-lg shadow-brand-blue/20"
              >
                <Save size={24} />
                <span>{editingBook ? "Save Changes" : "Add to Catalog"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { Book, BookStatus } from "../types";
import { X, Save, AlertCircle } from "lucide-react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Partial<Book>) => void;
  editingBook?: Book | null;
}

export default function BookModal({ isOpen, onClose, onSave, editingBook }: BookModalProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    author: "",
    genre: "",
    year: "",
    status: "Available",
    cover: ""
  });

  useEffect(() => {
    if (editingBook) {
      setFormData(editingBook);
    } else {
      setFormData({
        title: "",
        author: "",
        genre: "",
        year: "",
        status: "Available",
        cover: ""
      });
    }
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-f1-dark/95 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="relative bg-f1-black border-2 border-f1-red w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="bg-f1-red px-6 py-4 flex items-center justify-between">
          <h2 className="font-space font-bold uppercase tracking-tight text-xl">
            {editingBook ? "Update Telemetry" : "Register New Unit"}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        <form 
          className="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Book Title</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-f1-grey/20 border border-f1-grey focus:border-f1-red px-4 py-3 outline-none transition-colors font-medium"
                placeholder="The Art of Speed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Author / Constructor</label>
              <input 
                required
                type="text" 
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-f1-grey/20 border border-f1-grey focus:border-f1-red px-4 py-3 outline-none transition-colors font-medium"
                placeholder="Adrian Newey"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Genre / Category</label>
              <input 
                required
                type="text" 
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full bg-f1-grey/20 border border-f1-grey focus:border-f1-red px-4 py-3 outline-none transition-colors font-medium"
                placeholder="Engineering"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Launch Year</label>
              <input 
                required
                type="text" 
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-f1-grey/20 border border-f1-grey focus:border-f1-red px-4 py-3 outline-none transition-colors font-medium"
                placeholder="2026"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cover Image URL</label>
            <input 
              required
              type="url" 
              value={formData.cover}
              onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              className="w-full bg-f1-grey/20 border border-f1-grey focus:border-f1-red px-4 py-3 outline-none transition-colors font-medium"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
              className="w-full bg-f1-grey/20 border border-f1-grey focus:border-f1-red px-4 py-3 outline-none transition-colors font-medium appearance-none"
            >
              <option value="Available">Available for Pits</option>
              <option value="Borrowed">Active on Track</option>
              <option value="Reserved">In Reserve</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-f1-red hover:bg-white text-white hover:text-f1-black py-4 font-space font-bold uppercase tracking-widest transition-all"
            >
              <Save size={20} />
              {editingBook ? "Commit Changes" : "Deploy Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

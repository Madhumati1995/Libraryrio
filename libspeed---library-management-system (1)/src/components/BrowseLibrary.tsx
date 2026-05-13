import { useState, useMemo } from "react";
import { Book, BookStatus } from "../types";
import { Search, Filter, Database, CheckCircle2, CircleOff, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BookCard from "./BookCard";

interface BrowseLibraryProps {
  books: Book[];
  onView: (book: Book) => void;
}

export default function BrowseLibrary({ books, onView }: BrowseLibraryProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | null>(null);

  // Derive unique genres
  const genres = useMemo(() => {
    const defaultGenres = ["Computer Science"];
    const existing = Array.from(new Set(books.map(b => b.genre)));
    return Array.from(new Set([...defaultGenres, ...existing])).sort();
  }, [books]);

  // Filter logic
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                           book.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      const matchesStatus = !selectedStatus || book.status === selectedStatus;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, search, selectedGenre, selectedStatus]);

  return (
    <div className="space-y-10">
      {/* Search & Statistics Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
        <div className="w-full lg:max-w-xl space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block ml-1">Library Catalog Search</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by Title, Author or ISBN..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-brand-blue px-12 py-4 font-space font-medium outline-none transition-all rounded-xl shadow-inner shadow-slate-50"
            />
          </div>
        </div>

        <div className="flex gap-8 px-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Books Found</div>
            <div className="text-3xl font-space font-bold">{filteredBooks.length}<span className="text-brand-blue text-sm ml-1 font-medium">/ {books.length} Total</span></div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-2">
        {/* Genre/Category Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Tag size={14} />
            <span className="text-xs uppercase font-bold tracking-widest">Classifications</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-lg ${
                selectedGenre === null ? "bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/20" : "border-slate-200 text-slate-500 hover:border-brand-blue/40"
              }`}
            >
              All Types
            </button>
            {genres.map(genre => (
              <button 
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-lg ${
                  selectedGenre === genre ? "bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/20" : "border-slate-200 text-slate-500 hover:border-brand-blue/40"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Database size={14} />
            <span className="text-xs uppercase font-bold tracking-widest">Availability Status</span>
          </div>
          <div className="flex gap-2 bg-slate-50 p-1 border border-slate-100 rounded-xl">
            {[
              { id: "Available", label: "Available ", icon: CheckCircle2 },
              { id: "Borrowed", label: "Borrowed", icon: CircleOff },
              { id: "Reserved", label: "Reserved", icon: Filter }
            ].map((status) => (
              <button 
                key={status.id}
                onClick={() => setSelectedStatus(selectedStatus === status.id ? null : status.id as BookStatus)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg ${
                  selectedStatus === status.id ? "bg-white text-brand-dark shadow-sm ring-1 ring-slate-200" : "text-slate-400 hover:text-brand-blue"
                }`}
              >
                <status.icon size={14} />
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4 pt-8 border-t border-slate-100">
        <AnimatePresence mode="popLayout">
          {filteredBooks.map((book) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <BookCard 
                book={book} 
                role="Student"
                variant="row"
                onView={onView}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredBooks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center border-2 border-dashed border-slate-100 rounded-3xl"
          >
            <div className="mb-4 flex justify-center">
              <Database size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-space font-bold uppercase tracking-[0.3em]">Library Scan: Zero Results Found</p>
            <button 
              onClick={() => { setSearch(""); setSelectedGenre(null); setSelectedStatus(null); }}
              className="mt-6 text-brand-blue hover:text-brand-dark transition-colors text-[10px] font-bold uppercase tracking-widest font-space"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

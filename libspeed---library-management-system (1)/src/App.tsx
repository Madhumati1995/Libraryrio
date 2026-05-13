import { useState, useEffect } from "react";
import { Book, UserRole, User, Notification, BlogPost } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import BookDetailsModal from "./components/BookDetailsModal";
import UserManagement from "./components/UserManagement";
import AddBookPage from "./components/AddBookPage";
import BrowseLibrary from "./components/BrowseLibrary";
import EmployeePortal from "./components/EmployeePortal";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import { Plus, Search, Filter, ArrowRight, LayoutDashboard, Database, ArrowLeft, Bell, BookOpen, Clock, Activity, Shield, Users, Layers, ArrowUpRight, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [role, setRole] = useState<UserRole | "Login">("Home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [portalMode, setPortalMode] = useState<"Home" | "Management" | "AddBook">("Home");
  const [studentSection, setStudentSection] = useState<"Inventory" | "Borrowed" | "Notifications">("Inventory");
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Return Reminder", message: "Unit 'Aero Dynamics' is due in 48 hours.", type: "warning", date: "2 Hours Ago", isRead: false },
    { id: "2", title: "Reservation Ready", message: "Unit 'F1 Engineering' is now available for pickup.", type: "success", date: "5 Hours Ago", isRead: true },
  ]);

  useEffect(() => {
    if (role !== "Admin") {
      setPortalMode("Home");
    }
    if (role !== "Student") {
      setStudentSection("Inventory");
    }
  }, [role]);

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleSaveBook = async (bookData: Partial<Book>) => {
    const method = editingBook ? "PUT" : "POST";
    const url = editingBook ? `/api/books/${editingBook.id}` : "/api/books";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        fetchBooks();
        setIsModalOpen(false);
        setPortalMode("Home");
        setEditingBook(null);
      }
    } catch (error) {
      console.error("Failed to save book", error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book record?")) {
      try {
        await fetch(`/api/books/${id}`, { method: "DELETE" });
        fetchBooks();
      } catch (error) {
        console.error("Failed to delete book", error);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Remove this member from the library system?")) {
      try {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: UserRole) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  const [visibleCountLibrary, setVisibleCountLibrary] = useState(7);
  const [visibleCountBlog, setVisibleCountBlog] = useState(7);

  // Derive blog posts strictly from books present in database
  const blogPosts: BlogPost[] = books.map(book => ({
    id: `blog-${book.id}`,
    title: `Critical Review: ${book.title}`,
    excerpt: `How ${book.author} shaped modern literature with ${book.title}. We dive deep into the cultural impact and modern relevance of this specific work within our digital collection.`,
    author: "Portal Insights",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    category: book.category,
    image: book.cover,
    mediumLink: `https://medium.com/search?q=${encodeURIComponent(book.title + " " + book.author)}`
  }));

  // Recently Added 7 Books logic
  const recentlyAddedBooks = [...books].reverse().slice(0, visibleCountLibrary);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-blue selection:text-white">
      <Navbar 
        currentRole={role} 
        onRoleChange={(r) => setRole(r)} 
        search={search}
        onSearchChange={setSearch}
        currentUser={currentUser}
      />
      
      <main>
        {role === "Home" ? (
          <Hero 
            onGetStarted={() => setRole("Login")} 
            onNavigateBlog={() => setRole("Blog")}
            onNavigateContact={() => setRole("Contact")}
          />
        ) : (role === "Blog" || role === "Contact") ? null : (
          <div className="pt-20 pb-8 px-4 md:px-8 border-b-4 border-brand-blue bg-brand-light/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 hidden lg:block pointer-events-none opacity-[0.07]">
              <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800" alt="Decoration" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
               <motion.div 
                 key={role}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col md:flex-row md:items-end justify-between gap-6"
               >
                 <div>
                   <div className="inline-flex items-center gap-2 bg-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-4 rounded-full text-white">
                     <span>Authentication Verified</span>
                   </div>
                   <h1 className="font-space font-bold text-5xl md:text-7xl uppercase tracking-tighter text-slate-900">
                     {role === "Employee" ? "Employees" : role} <span className="text-brand-blue font-black italic">Portal</span>
                   </h1>
                 </div>

                 {role === "Student" && (
                   <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-lg">
                     <button 
                       onClick={() => setStudentSection("Inventory")}
                       className={`px-4 py-2 font-space font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 rounded-md ${
                         studentSection === "Inventory" ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-brand-blue"
                       }`}
                     >
                       <BookOpen size={14} />
                       Inventory
                     </button>
                     <button 
                       onClick={() => setStudentSection("Borrowed")}
                       className={`px-4 py-2 font-space font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 rounded-md ${
                         studentSection === "Borrowed" ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-brand-blue"
                       }`}
                     >
                       <Clock size={14} />
                       Borrowed
                     </button>
                     <button 
                       onClick={() => setStudentSection("Notifications")}
                       className={`px-4 py-2 font-space font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 rounded-md ${
                         studentSection === "Notifications" ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-brand-blue"
                       }`}
                     >
                       <Bell size={14} />
                       Alerts
                     </button>
                   </div>
                 )}

                 {role === "Admin" && (
                   <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-lg">
                     <button 
                       onClick={() => setPortalMode("Home")}
                       className={`px-6 py-2 font-space font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2 rounded-md ${
                         portalMode === "Home" ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-brand-blue"
                       }`}
                     >
                       <Shield size={14} />
                       Inventory
                     </button>
                     <button 
                       onClick={() => setPortalMode("Management")}
                       className={`px-6 py-2 font-space font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2 rounded-md ${
                         portalMode === "Management" ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-brand-blue"
                       }`}
                     >
                       <LayoutDashboard size={14} />
                       Analytics
                     </button>
                     <button 
                       onClick={() => setPortalMode("AddBook")}
                       className={`px-6 py-2 font-space font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2 rounded-md ${
                         portalMode === "AddBook" ? "bg-brand-blue text-white shadow-lg" : "text-slate-500 hover:text-brand-blue"
                       }`}
                     >
                       <Users size={14} />
                       Personnel
                     </button>
                   </div>
                 )}
               </motion.div>
            </div>
          </div>
        )}

        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <AnimatePresence mode="wait">
            {role === "Home" ? (
               <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-20">
                 <div className="flex flex-col items-center gap-8 py-24">
                    <button 
                      onClick={() => setRole("Student")}
                      className="group flex items-center gap-4 bg-brand-blue text-white hover:bg-brand-dark px-10 py-5 transition-all duration-300 rounded-lg shadow-lg"
                    >
                      <span className="font-space font-bold uppercase tracking-widest">Enter Student Portal</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
               </motion.div>
            ) : role === "Blog" ? (
                <motion.div key="blog-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                 <div className="relative py-24 px-8 overflow-hidden rounded-[3rem] bg-slate-50 border border-slate-100 group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-[0.08] group-hover:scale-105 transition-transform duration-[5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent" />
                    
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                         className="inline-flex items-center gap-2 bg-brand-blue text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-8 text-white shadow-lg shadow-brand-blue/20"
                       >
                         <span>Academic Journal</span>
                       </motion.div>
                       <h2 className="font-space font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-6 text-slate-900 leading-none">
                         The <span className="text-brand-blue italic">Medium</span> Library
                       </h2>
                       <p className="text-slate-500 text-lg md:text-xl font-medium">Curated insights, critical reviews, and deep dives into the literature representing our digital collection.</p>
                    </div>
                 </div>
                 
                  <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col gap-8">
                      {blogPosts.slice(0, visibleCountBlog).map((post) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          key={post.id} 
                          className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row"
                        >
                          <div className="w-full md:w-80 h-64 md:h-auto relative overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent opacity-0 md:opacity-100" />
                          </div>
                          <div className="p-8 md:p-12 flex flex-col flex-1 justify-center">
                            <div className="flex items-center gap-3 mb-6">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-light/50 px-3 py-1 rounded-full">
                                 {post.category}
                               </span>
                               <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                            </div>
                            <h3 className="font-space font-bold text-3xl md:text-4xl uppercase tracking-tighter mb-6 group-hover:text-brand-blue transition-colors leading-[0.9]">{post.title}</h3>
                            <p className="text-slate-500 text-lg mb-10 font-medium line-clamp-3 leading-relaxed max-w-2xl">{post.excerpt}</p>
                            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                               <div className="flex items-center gap-8">
                                 <a 
                                   href={post.mediumLink}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-900 group/link"
                                 >
                                   Access Full Report <div className="p-2 bg-slate-100 rounded-full group-hover/link:bg-brand-blue group-hover/link:text-white transition-colors rotate-45"><ArrowRight size={18} /></div>
                                 </a>
                                 <button 
                                   onClick={() => {
                                     const book = books.find(b => `blog-${b.id}` === post.id);
                                     if (book) {
                                       setViewingBook(book);
                                       setIsDetailsOpen(true);
                                     }
                                   }}
                                   className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-blue group/source"
                                 >
                                   View Book Source <div className="p-2 bg-brand-light rounded-full group-hover/source:bg-brand-blue group-hover/source:text-white transition-colors"><BookOpen size={18} /></div>
                                 </button>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {visibleCountBlog < blogPosts.length && (
                      <div className="flex justify-center pt-16">
                        <button 
                           onClick={() => setVisibleCountBlog(prev => prev + 12)}
                           className="font-space font-bold uppercase tracking-widest text-white bg-slate-900 hover:bg-brand-blue px-10 py-5 rounded-2xl transition-all shadow-xl flex items-center gap-3"
                         >
                           Access More Articles <Plus size={20} />
                         </button>
                      </div>
                    )}
                 </div>
               </motion.div>
            ) : role === "Contact" ? (
               <motion.div key="contact-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                   <div className="space-y-12 py-12">
                     <div>
                       <div className="text-brand-blue font-space font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Support Inquiries</div>
                       <h2 className="font-space font-bold text-5xl md:text-6xl uppercase tracking-tighter leading-[0.9]">
                         Get in <span className="text-brand-blue">Touch</span> with our staff
                       </h2>
                     </div>
                     
                     <div className="space-y-8">
                        <div className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-blue/30 transition-colors">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                              <Mail size={24} />
                           </div>
                           <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Distribution</div>
                              <div className="font-space font-bold text-slate-900">support@library-portal.edu</div>
                           </div>
                        </div>
                        <div className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-blue/30 transition-colors">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                              <Shield size={24} />
                           </div>
                           <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Security Desk</div>
                              <div className="font-space font-bold text-slate-900">+1 (888) LIBRARY-SEC</div>
                           </div>
                        </div>
                     </div>
                   </div>
                   
                   <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[100px]" />
                      <div className="relative z-10 space-y-8">
                         <h3 className="font-space font-bold text-white text-2xl uppercase tracking-tight">Direct Messaging</h3>
                         <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Area</label>
                               <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-brand-blue transition-colors font-bold uppercase tracking-widest text-xs">
                                  <option className="bg-slate-900">Research Assistance</option>
                                  <option className="bg-slate-900">Account Recovery</option>
                                  <option className="bg-slate-900">Book Donation</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Message</label>
                               <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-brand-blue transition-colors resize-none placeholder:text-slate-600" placeholder="Describe your request in detail..."></textarea>
                            </div>
                            <button className="w-full bg-brand-blue hover:bg-brand-dark text-white font-space font-bold uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                               Transmit Signal <ArrowUpRight size={20} />
                            </button>
                         </form>
                      </div>
                   </div>
                 </div>
               </motion.div>
             ) : role === "Student" ? (
               <motion.div 
                 key={`student-${studentSection}`} 
                 initial={{ opacity: 0, x: -10 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 className="space-y-12"
               >
                 {studentSection === "Inventory" ? (
                   <>
                     <div className="text-center py-12 border-b border-slate-100">
                        <h2 className="font-space font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-4">
                          Library <span className="text-brand-blue">Catalog</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Browse our extensive collection of books, academic papers, and technical resources.</p>
                     </div>
                     <BrowseLibrary 
                        books={books}
                        onView={(b) => {
                          setViewingBook(b);
                          setIsDetailsOpen(true);
                        }}
                      />
                   </>
                 ) : studentSection === "Borrowed" ? (
                    <div className="space-y-8">
                      <div className="text-center py-12 border-b border-slate-100">
                        <h2 className="font-space font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-4">
                          My <span className="text-brand-blue">Loans</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Manage your active book rentals and track upcoming due dates.</p>
                      </div>
                      
                      {books.filter(b => b.status === "Borrowed").length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {books.filter(b => b.status === "Borrowed").map((book) => (
                            <BookCard 
                              key={`loan-${book.id}`}
                              book={book}
                              role={role}
                              onEdit={() => {}}
                              onDelete={() => {}}
                              onView={(b) => {
                                setViewingBook(b);
                                setIsDetailsOpen(true);
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="py-20 text-center text-slate-400 uppercase font-black tracking-widest border-2 border-dashed border-slate-100 rounded-3xl">
                          No Active Loans Recorded
                        </div>
                      )}
                    </div>
                 ) : (
                    <div className="space-y-8">
                       <div className="text-center py-12 border-b border-slate-100">
                        <h2 className="font-space font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-4">
                          Student <span className="text-brand-blue">Alerts</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Important notifications regarding your account, arrivals, and due dates.</p>
                      </div>
                      
                      <div className="max-w-2xl mx-auto space-y-4">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-6 border-l-4 ${
                              notif.type === "warning" ? "border-amber-500 bg-amber-50/50" : 
                              notif.type === "success" ? "border-emerald-500 bg-emerald-50/50" : 
                              "border-brand-blue bg-blue-50/50"
                            } rounded-r-xl flex justify-between items-center`}
                          >
                            <div>
                               <h4 className="font-space font-bold uppercase tracking-tight text-lg mb-1">{notif.title}</h4>
                               <p className="text-slate-600 text-sm">{notif.message}</p>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                 )}
               </motion.div>
            ) : role === "Login" ? (
               <motion.div key="auth-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                 <Auth onAuthSuccess={(user) => {
                   setCurrentUser(user);
                   setRole(user.role);
                 }} />
               </motion.div>
            ) : portalMode === "Home" ? (
               <motion.div
                 key={role}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
               >
                 {role === "Employee" ? (
                   <EmployeePortal 
                     books={books}
                     onAdd={() => setPortalMode("AddBook")}
                     onEdit={(b) => {
                       setEditingBook(b);
                       setPortalMode("AddBook");
                     }}
                     onDelete={handleDeleteBook}
                     onView={(b) => {
                       setViewingBook(b);
                       setIsDetailsOpen(true);
                     }}
                   />
                 ) : (
                   /* Admin Inventory view (table like employee) */
                   <EmployeePortal 
                     books={books}
                     onAdd={() => setPortalMode("AddBook")}
                     onEdit={(b) => {
                       setEditingBook(b);
                       setPortalMode("AddBook");
                     }}
                     onDelete={handleDeleteBook}
                     onView={(b) => {
                       setViewingBook(b);
                       setIsDetailsOpen(true);
                     }}
                   />
                 )}
               </motion.div>
            ) : portalMode === "Management" ? (
              <AdminDashboard 
                books={books}
                users={users}
              />
            ) : portalMode === "AddBook" && role === "Admin" ? (
               <motion.div
                key="admin-management"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UserManagement 
                  users={users} 
                  onDelete={handleDeleteUser} 
                  onUpdateRole={handleUpdateUserRole} 
                />
              </motion.div>
            ) : portalMode === "AddBook" ? (
              <AddBookPage 
                onSave={handleSaveBook}
                onCancel={() => {
                  setPortalMode("Home");
                  setEditingBook(null);
                }}
                editingBook={editingBook}
              />
            ) : null}
          </AnimatePresence>
        </section>

        {/* Footer Statistics - Ribbon Style */}
        <div className="bg-brand-blue py-1 mt-12 mb-20 relative overflow-hidden">
           <div className="flex whitespace-nowrap animate-marquee py-2 gap-12 font-space font-black uppercase text-2xl tracking-tighter text-white/20">
             <span>Knowledge is Power • Library Open 2026 • Read. Learn. Grow. • Knowledge is Power • Library Open 2026 • Read. Learn. Grow. • Knowledge is Power • Library Open 2026 • Read. Learn. Grow.</span>
           </div>
        </div>
      </main>

      <footer className="bg-slate-50 pt-20 pb-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-blue flex items-center justify-center font-space font-bold text-lg rounded-lg text-white">
                  <span>L</span>
                </div>
                <span className="font-space font-bold text-xl tracking-tighter text-slate-900">
                  LIB<span className="text-brand-blue">RIO</span>
                </span>
              </div>
              <p className="text-slate-500 max-w-md leading-relaxed">
                The official library management system of the Tech Academy. Providing seamless access to global knowledge resources.
              </p>
            </div>
            
            <div>
              <h4 className="font-space font-bold uppercase tracking-widest text-xs mb-6 text-slate-400">Portals</h4>
              <ul className="space-y-4 text-slate-600 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-blue transition-colors flex items-center gap-2">Student Hub <ArrowRight size={12} /></a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors flex items-center gap-2">Employee Portal <ArrowRight size={12} /></a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors flex items-center gap-2">Admin Command <ArrowRight size={12} /></a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-space font-bold uppercase tracking-widest text-xs mb-6 text-slate-400">Connect</h4>
              <ul className="space-y-4 text-slate-600 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-blue transition-colors">Twitter / X</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>© 2026 Librio Management. All Rights Reserved.</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-blue transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      <BookModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />

      <BookDetailsModal 
        isOpen={isDetailsOpen}
        book={viewingBook}
        role={role}
        onEdit={(b) => {
          setViewingBook(null);
          setIsDetailsOpen(false);
          setEditingBook(b);
          setPortalMode("AddBook");
        }}
        onDelete={(id) => {
          handleDeleteBook(id);
          setIsDetailsOpen(false);
          setViewingBook(null);
        }}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingBook(null);
        }}
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

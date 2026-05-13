import { User, UserRole } from "../types";
import { LogIn, User as UserIcon, Settings, Home, ShieldCheck, Search, BookMarked, Layers } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  currentRole: UserRole | "Login";
  onRoleChange: (role: UserRole | "Login") => void;
  search: string;
  onSearchChange: (value: string) => void;
  currentUser: User | null;
}

export default function Navbar({ currentRole, onRoleChange, search, onSearchChange, currentUser }: NavbarProps) {
  const roles: UserRole[] = ["Home", "Student", "Employee", "Admin"]; // Keep core roles in the switcher
  const navLinks: { label: string; role: UserRole | "Login" }[] = [
    { label: "Home", role: "Home" },
    { label: "Blog", role: "Blog" },
    { label: "Contact", role: "Contact" },
  ];

  const getRoleIcon = (role: UserRole | "Login") => {
    switch (role) {
      case "Student": return <UserIcon size={18} />;
      case "Employee": return <Settings size={18} />;
      case "Admin": return <ShieldCheck size={18} />;
      case "Login": return <LogIn size={18} />;
      default: return <Home size={18} />;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onRoleChange("Home")}>
          <div className="w-10 h-10 bg-brand-blue flex items-center justify-center rounded-lg text-white group-hover:rotate-6 transition-transform">
             <BookMarked size={24} />
          </div>
          <span className="font-space font-bold text-2xl tracking-tighter hidden md:block text-slate-900 uppercase">
            LIB<span className="text-brand-blue">RIO</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-slate-500">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={() => onRoleChange(link.role)}
              className={`transition-colors border-b-2 pb-1 ${currentRole === link.role ? "text-brand-blue border-brand-blue" : "border-transparent hover:text-brand-blue"}`}
            >
              {link.label}
            </button>
          ))}
          {!currentUser && (
            <button 
              onClick={() => onRoleChange("Login")}
              className={`transition-colors border-b-2 pb-1 flex items-center gap-2 ${currentRole === "Login" ? "text-brand-blue border-brand-blue" : "border-transparent hover:text-brand-blue"}`}
            >
              Access <LogIn size={14} />
            </button>
          )}
        </div>

        {/* Navbar Search */}
        <div className="hidden md:flex relative ml-8 w-64 items-center">
            <Search className="absolute left-3 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH LIBRARY..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-brand-blue pl-9 pr-4 py-1.5 text-[10px] tracking-widest font-bold uppercase outline-none transition-all w-full rounded-md"
            />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Portal Access</p>
              <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
            </div>
            <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        )}
        
        <div className="flex bg-slate-50 rounded-full p-1 border border-slate-200">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                currentRole === role 
                  ? "bg-brand-blue text-white shadow-md" 
                  : "text-slate-400 hover:text-brand-blue"
              }`}
            >
              {currentRole === role && getRoleIcon(role)}
              {role}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

import React, { useState } from "react";
import { User, UserRole } from "../types";
import { motion } from "motion/react";
import { Mail, Lock, User as UserIcon, Book, Hash, GraduationCap, ChevronRight } from "lucide-react";

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    department: "",
    role: "Student" as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Mock login: find user by email
      try {
        const res = await fetch("/api/users");
        const users: User[] = await res.json();
        const user = users.find(u => u.email === formData.email);
        if (user) {
          onAuthSuccess(user);
        } else {
          alert("User not found. Please register.");
        }
      } catch (error) {
        console.error("Login failed", error);
      }
    } else {
      // Register: create new user
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            age: parseInt(formData.age),
            department: formData.department,
            role: formData.role
          }),
        });
        if (res.ok) {
          const newUser = await res.json();
          onAuthSuccess(newUser);
        }
      } catch (error) {
        console.error("Registration failed", error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-space font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-4">
          {isLogin ? "Welcome" : "Create"} <span className="text-brand-blue">{isLogin ? "Back" : "Account"}</span>
        </h2>
        <p className="text-slate-500 font-medium">
          {isLogin ? "Enter your credentials to access your library portal." : "Join our community and start your literary journey today."}
        </p>
      </div>

      <motion.div 
        layout
        className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-brand-blue transition-colors font-medium" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-brand-blue transition-colors font-medium" 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-brand-blue transition-colors font-medium" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Age</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-brand-blue transition-colors font-medium" 
                      placeholder="21" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Type</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-brand-blue transition-colors font-bold uppercase tracking-widest text-xs"
                  >
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department / Course</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-brand-blue transition-colors font-medium" 
                    placeholder="Computer Science" 
                  />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit"
            className="w-full bg-brand-blue text-white font-space font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-brand-dark transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            {isLogin ? "Sign In" : "Create Account"}
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 font-medium mb-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-blue font-bold uppercase tracking-widest text-xs hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in to your account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

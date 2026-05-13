import { motion } from "motion/react";
import { ChevronRight, Play } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
  onNavigateBlog: () => void;
  onNavigateContact: () => void;
}

export default function Hero({ onGetStarted, onNavigateBlog, onNavigateContact }: HeroProps) {
  return (
    <div className="relative pt-32 pb-24 px-4 md:px-8 border-b border-slate-100 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 pointer-events-none border-l border-slate-100 hidden lg:block overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
            alt="Main Library" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/50 to-white" />
        </motion.div>
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:24px_24px]"></div>
      </div>
      <div className="absolute top-0 right-1/2 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none hidden lg:block" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent to-white pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-light text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full mb-6 border border-brand-blue/10">
            <span>Academic Year 2026</span>
          </div>
          
          <h1 className="font-space font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85] uppercase mb-8 text-slate-900">
            Explore the<br />
            World Through <span className="text-brand-blue underline decoration-brand-blue/20">Books</span>
          </h1>
          
          <div className="flex flex-wrap gap-4 mt-12">
            <button 
              onClick={onGetStarted}
              className="group flex items-center gap-4 bg-brand-blue hover:bg-brand-dark text-white px-8 py-4 transition-all duration-300 rounded-xl shadow-lg shadow-brand-blue/20"
            >
              <span className="font-space font-bold uppercase tracking-tight">Access Portal</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <button 
              onClick={onNavigateBlog}
              className="flex items-center gap-4 bg-white border border-slate-200 hover:border-brand-blue hover:text-brand-blue px-8 py-4 transition-all duration-300 rounded-xl font-space font-bold uppercase tracking-tight"
            >
              Library Blog
            </button>
            <button 
              onClick={onNavigateContact}
              className="flex items-center gap-4 bg-white border border-slate-200 hover:border-brand-blue hover:text-brand-blue px-8 py-4 transition-all duration-300 rounded-xl font-space font-bold uppercase tracking-tight"
            >
              Technical Support
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative lines */}
      <div className="absolute bottom-10 right-0 flex flex-col gap-2 md:opacity-100 opacity-50">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-1 bg-brand-blue/5 rounded-l-full self-end" 
            style={{ width: `${i * 150}px` }}
          />
        ))}
      </div>
    </div>
  );
}

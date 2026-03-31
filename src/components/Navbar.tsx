import { Zap, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

interface NavbarProps {
  user?: any;
  role?: string;
}

export const Navbar = ({ user, role }: NavbarProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass px-6 py-3 flex justify-between items-center rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">
            HI TECH <span className="text-indigo-400">ACADEMY</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'home' }))} className="hover:text-white transition">Home</button>
          <button onClick={() => {
            window.dispatchEvent(new CustomEvent('nav', { detail: 'home' }));
            setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
          }} className="hover:text-white transition">About Harar</button>
          <button onClick={() => {
            window.dispatchEvent(new CustomEvent('nav', { detail: 'home' }));
            setTimeout(() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' }), 100);
          }} className="hover:text-white transition">Science Lab</button>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold">{role?.toUpperCase()}</p>
              <p className="text-[10px] text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-red-400 hover:bg-red-400/10 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'login' }))} className="px-5 py-2 glass hover:bg-white/10 transition text-sm font-medium rounded-xl">Login</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'signup' }))} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20">Get Started</button>
          </div>
        )}
      </div>
    </nav>
  );
};

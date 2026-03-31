import { useState, useEffect, FormEvent } from "react";
import { supabase } from "./lib/supabase";
import { Navbar } from "./components/Navbar";
import { GlassCard } from "./components/GlassCard";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Layers, Cpu, FileText, Upload, Trash2, ExternalLink, MapPin, Beaker, GraduationCap, Globe, Zap } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [view, setView] = useState<string>("home");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    const handleNav = (e: any) => setView(e.detail);
    window.addEventListener('nav', handleNav);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('nav', handleNav);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      if (view === 'login' || view === 'signup') setView(data.role);
    } else {
      const { data: newProfile } = await supabase.from('users').insert([{ id: userId, email: user?.email, role: 'student' }]).select().single();
      setProfile(newProfile);
      setView('student');
    }
  };

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (profile?.role === 'student') query = query.or('audience.eq.student,audience.eq.all');
    if (profile?.role === 'teacher') query = query.or('audience.eq.teacher,audience.eq.all');
    
    const { data } = await query;
    if (data) setPosts(data);
  };

  useEffect(() => {
    if (profile) fetchPosts();
  }, [profile]);

  if (loading) return <div className="fixed inset-0 bg-slate-950 flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen">
      <div className="mesh-gradient" />
      <Navbar user={user} role={profile?.role} />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === "home" && <HomeView />}
          {view === "login" && <AuthView mode="login" setView={setView} />}
          {view === "signup" && <AuthView mode="signup" setView={setView} />}
          {(view === "admin" || view === "student" || view === "teacher") && (
            <DashboardView profile={profile} posts={posts} fetchPosts={fetchPosts} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function PeriodicTable() {
  const elements = [
    { symbol: 'H', name: 'Hydrogen', mass: '1.008', color: 'bg-blue-500/20' },
    { symbol: 'He', name: 'Helium', mass: '4.002', color: 'bg-purple-500/20' },
    { symbol: 'Li', name: 'Lithium', mass: '6.941', color: 'bg-red-500/20' },
    { symbol: 'Be', name: 'Beryllium', mass: '9.012', color: 'bg-orange-500/20' },
    { symbol: 'B', name: 'Boron', mass: '10.81', color: 'bg-green-500/20' },
    { symbol: 'C', name: 'Carbon', mass: '12.01', color: 'bg-indigo-500/20' },
    { symbol: 'N', name: 'Nitrogen', mass: '14.007', color: 'bg-emerald-500/20' },
    { symbol: 'O', name: 'Oxygen', mass: '15.999', color: 'bg-cyan-500/20' },
    { symbol: 'F', name: 'Fluorine', mass: '18.998', color: 'bg-sky-500/20' },
    { symbol: 'Ne', name: 'Neon', mass: '20.180', color: 'bg-indigo-500/20' },
    { symbol: 'Na', name: 'Sodium', mass: '22.990', color: 'bg-red-600/20' },
    { symbol: 'Mg', name: 'Magnesium', mass: '24.305', color: 'bg-orange-600/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 periodic-container">
      {elements.map((el, i) => (
        <motion.div
          key={el.symbol}
          initial={{ opacity: 0, rotateY: -90 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: i * 0.1, duration: 0.8 }}
          className={`glass p-6 rounded-xl border border-white/10 element-card h-40 flex flex-col items-center justify-center relative overflow-hidden group`}
        >
          <div className={`absolute inset-0 ${el.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
          <span className="text-xs text-gray-500 absolute top-2 left-2 font-mono">{i + 1}</span>
          <span className="text-4xl font-black text-white mb-1">{el.symbol}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">{el.name}</span>
          <span className="text-[8px] text-gray-600 mt-2">{el.mass}</span>
        </motion.div>
      ))}
    </div>
  );
}

function HomeView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-32">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-12 pt-20">
        <div className="space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-indigo-400 text-sm font-bold border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.15)] mx-auto"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>EMPOWERING ETHIOPIA'S FUTURE</span>
          </motion.div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            THE NEXT GEN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">TECH LEADERS</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Located in the historic city of Harar, Hi Tech Academy combines the rich cultural background of Ethiopia with cutting-edge STEM education. Our students are trained in AI, Robotics, and Software Engineering from day one.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="glass p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
              <GraduationCap className="w-8 h-8 text-yellow-500 mb-2 mx-auto group-hover:scale-110 transition-transform" />
              <h4 className="font-bold">Top Results</h4>
              <p className="text-xs text-gray-500">Leading national exam scores in Harari Region.</p>
            </div>
            <div className="glass p-4 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors group">
              <Cpu className="w-8 h-8 text-green-500 mb-2 mx-auto group-hover:scale-110 transition-transform" />
              <h4 className="font-bold">Tech First</h4>
              <p className="text-xs text-gray-500">1:1 Student to Laptop ratio in all classes.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'signup' }))} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 transition rounded-2xl text-lg font-black shadow-[0_0_30px_rgba(79,70,229,0.4)] transform hover:scale-105 active:scale-95">
              JOIN THE ACADEMY
            </button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 glass hover:bg-white/10 transition rounded-2xl text-lg font-bold border border-white/10">
              EXPLORE CAMPUS
            </button>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-2 gap-8">
        <GlassCard delay={0.1} className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -z-10 group-hover:bg-indigo-600/20 transition-colors" />
          <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
            <Globe className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-bold mb-4 tracking-tight">Our Vision</h3>
          <p className="text-gray-400 text-lg leading-relaxed">To empower Ethiopian youth with world-class technical education, fostering innovation that resonates globally while staying rooted in our rich cultural heritage.</p>
        </GlassCard>
        <GlassCard delay={0.2} className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -z-10 group-hover:bg-purple-600/20 transition-colors" />
          <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
            <GraduationCap className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-3xl font-bold mb-4 tracking-tight">Our Mission</h3>
          <p className="text-gray-400 text-lg leading-relaxed">Our mission is to provide a rigorous, tech-focused curriculum that prepares students for the challenges of the digital age, creating the next generation of leaders.</p>
        </GlassCard>
      </section>

      {/* 3D Science Lab Section */}
      <section id="science" className="space-y-12 py-10">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20"
          >
            <Beaker className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <h2 className="text-6xl font-black tracking-tighter">VIRTUAL <span className="text-indigo-400">SCIENCE LAB</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Interactive 3D periodic table and chemical simulations for our advanced chemistry students. Experience science in a whole new dimension.</p>
        </div>
        <div className="glass p-8 rounded-[3rem] border border-white/5 shadow-inner">
          <PeriodicTable />
        </div>
      </section>

      {/* Harar Map & Info Section */}
      <section id="about" className="glass rounded-[40px] p-8 md:p-16 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] -z-10 group-hover:bg-indigo-600/20 transition-colors duration-1000" />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold tracking-[0.2em] text-xs uppercase">
              <MapPin className="w-5 h-5" /> HARAR, ETHIOPIA
            </div>
            <h2 className="text-6xl font-black leading-[0.9] tracking-tighter">THE WALLED CITY'S <br /> <span className="text-indigo-400">TECH HUB</span></h2>
            <p className="text-gray-400 text-xl leading-relaxed">
              Hi Tech Academy is situated just outside the historic Jugol Walls of Harar. We believe that the discipline and wisdom of our ancestors provide the perfect foundation for mastering modern technology.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "State-of-the-art Computer Labs",
                "Fiber-optic Connectivity",
                "Robotics & AI Center",
                "Innovation Incubator"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 glass px-4 py-3 rounded-xl border border-white/5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[500px] rounded-[2.5rem] overflow-hidden glass border border-white/10 shadow-2xl relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15754.74312484435!2d42.1158141!3d9.3126343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16310196720d2077%3A0x633513369680326b!2sHarar!5e0!3m2!1sen!2set!4v1711880000000!5m2!1sen!2set" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[2.5rem]" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <GlassCard delay={0.1}>
          <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Secure Auth</h3>
          <p className="text-gray-400">Enterprise-grade security powered by Supabase infrastructure.</p>
        </GlassCard>
        <GlassCard delay={0.2}>
          <Layers className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold mb-2">3D Interface</h3>
          <p className="text-gray-400">Stunning glass morphism design for an immersive experience.</p>
        </GlassCard>
        <GlassCard delay={0.3}>
          <Cpu className="w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Real-time</h3>
          <p className="text-gray-400">Instant updates and notifications for all academy events.</p>
        </GlassCard>
      </section>
    </motion.div>
  );
}

function AuthView({ mode, setView }: { mode: 'login' | 'signup', setView: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else if (data.user) {
        await supabase.from('users').insert([{ id: data.user.id, email, full_name: name, role: 'student' }]);
        alert("Signup successful! Please login.");
        setView('login');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto">
      <GlassCard className="p-10">
        <h2 className="text-3xl font-bold mb-8 text-center">{mode === 'login' ? 'Welcome Back' : 'Join Academy'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold shadow-xl shadow-indigo-500/20 transition transform active:scale-95 uppercase tracking-widest">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-8 text-sm text-gray-400">
          {mode === 'login' ? "New here? " : "Already have an account? "}
          <button onClick={() => setView(mode === 'login' ? 'signup' : 'login')} className="text-indigo-400 font-bold hover:underline">
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </GlassCard>
    </motion.div>
  );
}

function DashboardView({ profile, posts, fetchPosts }: { profile: any, posts: any[], fetchPosts: any }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audience, setAudience] = useState("all");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('files').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(fileName);

      let type = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type === 'application/pdf') type = 'pdf';

      const { error: dbError } = await supabase.from('posts').insert([{
        title,
        description: desc,
        audience,
        file_url: publicUrl,
        type,
        user_id: profile.id
      }]);

      if (dbError) throw dbError;
      alert("Post published!");
      setTitle(""); setDesc(""); setFile(null);
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <header>
        <h2 className="text-4xl font-black mb-2">Welcome, {profile?.full_name || 'User'}</h2>
        <p className="text-gray-400">Role: <span className="text-indigo-400 font-bold uppercase">{profile?.role}</span></p>
      </header>

      {(profile?.role === 'admin' || profile?.role === 'teacher') && (
        <GlassCard className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Upload className="w-5 h-5" /> Publish New Content</h3>
          <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" placeholder="Content Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition" />
              <textarea placeholder="Description" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="space-y-4">
              <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition">
                <option value="all">Public (All)</option>
                <option value="student">Students Only</option>
                <option value="teacher">Teachers Only</option>
              </select>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
              <button type="submit" disabled={uploading} className="w-full bg-indigo-600 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition disabled:opacity-50">
                {uploading ? 'UPLOADING...' : 'PUBLISH CONTENT'}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <GlassCard key={post.id} delay={i * 0.1} className="flex flex-col h-full group">
            <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
              {post.type === 'image' && <img src={post.file_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
              {post.type === 'video' && <video src={post.file_url} className="w-full h-full bg-black" controls />}
              {post.type === 'pdf' && <div className="w-full h-full bg-indigo-900/20 flex items-center justify-center"><FileText className="w-12 h-12 text-indigo-400" /></div>}
              <div className="absolute top-2 right-2 px-2 py-1 glass text-[10px] uppercase font-bold tracking-wider rounded-md">{post.audience}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-indigo-300">{post.title}</h3>
            <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-3">{post.description}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
              <span className="text-[10px] text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
              <div className="flex gap-2">
                <a href={post.file_url} target="_blank" className="p-2 glass hover:bg-white/10 rounded-lg transition"><ExternalLink className="w-4 h-4" /></a>
                {profile?.role === 'admin' && <button onClick={() => deletePost(post.id)} className="p-2 glass hover:bg-red-400/20 text-red-400 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}

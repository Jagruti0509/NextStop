import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Let\'s explore 🌍');
      navigate('/dashboard');
    } else {
      const isEmailTaken = result.message?.toLowerCase().includes('already');
      toast.error(
        isEmailTaken
          ? `${result.message} — try signing in instead.`
          : result.message || 'Registration failed. Please try again.'
      );
      if (isEmailTaken) {
        setTimeout(() => navigate('/login'), 2500);
      }
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80"
          alt="NextStop travel adventure"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-primary-950/75 to-coral-950/50" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full w-full">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <Compass className="w-6 h-6 text-accent-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black font-display tracking-tighter text-white">NextStop<span className="text-accent-400">.</span></span>
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-black">AI Co-pilot</span>
            </div>
          </div>
          <h1 className="text-6xl font-black font-display mb-6 leading-tight tracking-tight">
            Your travel story<br />starts here.
          </h1>
          <p className="text-white/80 text-xl font-medium leading-relaxed max-w-lg">
            Join thousands of smart travelers planning optimized itineraries, sharing memories, and discovering the world's best kept secrets.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative">
        {/* Background glowing gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md animate-slide-up relative z-10">
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">NextStop<span className="text-accent-400">.</span></span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">AI Co-pilot</span>
            </div>
          </div>
 
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-2.5">Create account</h2>
            <p className="text-gray-500 dark:text-slate-400 font-medium text-base">Start planning beautiful trips in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-slate-700 dark:text-slate-300">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input type="text" className="input-field pl-11 py-3.5 focus:ring-accent-500" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label text-slate-700 dark:text-slate-300">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input type="email" className="input-field pl-11 py-3.5 focus:ring-accent-500" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} className="input-field pl-11 pr-11 py-3.5 focus:ring-accent-500" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label text-slate-700 dark:text-slate-300">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input type="password" className="input-field pl-11 py-3.5 focus:ring-accent-500" placeholder="Confirm password"
                  value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-primary-500/10 mt-4">
              {isLoading
                ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-650 dark:text-primary-400 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

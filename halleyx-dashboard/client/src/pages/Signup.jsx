import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Galaxy from '../components/Backgrounds/Galaxy';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Galaxy 
          hueShift={280} // More purple/magenta for signup
          saturation={0.5} 
          glowIntensity={0.5} 
          speed={0.2} 
        />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-borderLight p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="text-center mb-10 relative">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                  <div className="w-8 h-8 bg-primary rounded-xl -rotate-6 shadow-lg shadow-primary/20 flex items-center justify-center text-white font-bold italic">H</div>
              </div>
              <h1 className="text-3xl font-bold text-textPrimary font-display tracking-tight">
                  Join Hallex
              </h1>
              <p className="mt-3 text-textSecondary text-sm font-medium">Create your intelligent dashboard account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-2xl border border-red-100 text-center flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-textTertiary group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-background border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none text-textPrimary placeholder:text-textTertiary"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-textTertiary group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-background border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none text-textPrimary placeholder:text-textTertiary"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-textTertiary group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-background border border-borderLight rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none text-textPrimary placeholder:text-textTertiary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="group w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-textTertiary font-medium">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-textTertiary uppercase tracking-[0.2em]">Enterprise Intelligence System v2.0</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

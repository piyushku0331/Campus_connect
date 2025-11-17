import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error.message);
        toast.error(error.message || 'Login failed');
      } else {
        toast.success('Welcome back! Redirecting to dashboard...');

        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="min-h-screen flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-12 pt-32">
          <div className="w-full max-w-[90%] sm:max-w-[70%] md:max-w-md mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_0_25px_rgba(107,159,255,0.1)] hover:shadow-[0_0_40px_rgba(107,159,255,0.15)] transition-all duration-300 relative"
        >
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#6B9FFF] to-[#7F40FF] bg-clip-text text-transparent mb-4 block">
              Campus Connect
            </Link>
            <h2 className="text-xl font-semibold text-gray-100 tracking-wide drop-shadow-[0_0_10px_rgba(107,159,255,0.25)] mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Sign in to continue your journey
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-textPrimary font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#6B9FFF] transition-colors duration-200" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#151824]/80 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B9FFF]/40 focus-within:shadow-[0_0_15px_rgba(107,159,255,0.25)] focus-within:border-[#6B9FFF]/30 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-textPrimary font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/3 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#6B9FFF] transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-[#151824]/80 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B9FFF]/40 focus-within:shadow-[0_0_15px_rgba(107,159,255,0.25)] focus-within:border-[#6B9FFF]/30 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-80 bottom-6 transform -translate-y-1/2 text-gray-400 hover:text-[#6B9FFF] transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
              >
                <p className="text-red-400 text-center text-sm">{error}</p>
              </motion.div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-medium rounded-xl bg-gradient-to-r from-[#6B9FFF] to-[#7F40FF] text-white shadow-[0_0_20px_rgba(107,159,255,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(107,159,255,0.4)] active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col sm:flex-row items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-200" />
                </>
              )}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Don&rsquo;t have an account?{' '}
              <Link
                to="/signup"
                className="text-sm text-gray-400 hover:text-[#6B9FFF] transition-all duration-200 hover:underline underline-offset-4 decoration-[#6B9FFF]/60 font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

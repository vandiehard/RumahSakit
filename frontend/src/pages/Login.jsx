import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, ArrowLeft, HeartPulse, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { ToastContainer, useToast } from '../components/Toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toasts, toast, remove } = useToast();

  // Sync dark mode state from localStorage (set by LandingPage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const theme = localStorage.getItem('theme');
      return theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Apply theme class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const willBeDark = !document.documentElement.classList.contains('dark');
    if (willBeDark) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        toast.success(`Selamat datang, ${user.nama}! 🎉`);
        setTimeout(() => {
          if (user.jabatan === 'Admin') navigate('/admin');
          else if (user.jabatan === 'Dokter') navigate('/dokter');
          else if (user.jabatan === 'Perawat') navigate('/perawat');
        }, 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan server';
      toast.error(`❌ Login gagal: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">

      {/* Top-left: back link */}
      <Link to="/" className="absolute top-8 left-8 flex items-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 transition font-medium">
        <ArrowLeft className="h-5 w-5 mr-2" /> Kembali ke Beranda
      </Link>

      {/* Top-right: theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
        title={isDarkMode ? 'Aktifkan Tema Terang' : 'Aktifkan Tema Gelap'}
      >
        {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
      </button>

      {/* Card */}
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">

        {/* Logo + Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary/10 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
            <HeartPulse className="h-10 w-10 text-primary dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Portal Pegawai</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Masuk untuk mengakses dashboard sesuai role Anda.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          {/* Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="input-field pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              placeholder="Username (contoh: admin / dokter_andi)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="input-field pl-10 pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Hint accounts */}
          <div className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">Akun Demo:</p>
            <p>👤 Admin: <span className="font-mono">admin</span> / <span className="font-mono">admin123</span></p>
            <p>🩺 Dokter: <span className="font-mono">dokter_andi</span> / <span className="font-mono">dokter123</span></p>
            <p>💉 Perawat: <span className="font-mono">perawat_ani</span> / <span className="font-mono">perawat123</span></p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memproses...
              </>
            ) : 'Masuk Sekarang'}
          </button>
        </form>
      </div>

      {/* Toast */}
      <ToastContainer toasts={toasts} remove={remove} />
    </div>
  );
};

export default Login;

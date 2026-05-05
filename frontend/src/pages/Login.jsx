import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, ArrowLeft, HeartPulse } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        
        if (user.jabatan === 'Admin') navigate('/admin');
        else if (user.jabatan === 'Dokter') navigate('/dokter');
        else if (user.jabatan === 'Perawat') navigate('/perawat');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-slate-600 hover:text-primary transition font-medium">
        <ArrowLeft className="h-5 w-5 mr-2" /> Kembali ke Beranda
      </Link>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <HeartPulse className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Portal Pegawai</h2>
          <p className="mt-2 text-sm text-slate-500">
            Masuk untuk mengakses dashboard sesuai role Anda.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field pl-10"
                placeholder="Username (contoh: admin / dokter_andi)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field pl-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm text-slate-500">
          Super Admin: admin/admin123<br/>
          Dokter: dokter_andi/dokter123<br/>
          Perawat: perawat_ani/perawat123
        </div>
      </div>
    </div>
  );
};

export default Login;

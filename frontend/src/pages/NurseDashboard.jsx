import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, ClipboardList, Activity, Sun, Moon } from 'lucide-react';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const theme = localStorage.getItem('theme');
      return theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.jabatan !== 'Perawat') {
      navigate('/login');
    } else {
      setUser(userData);
      fetchJadwal(userData.id);
    }
  }, [navigate]);

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

  const fetchJadwal = async (id_perawat) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/perawat/jadwal/${id_perawat}`);
      setJadwal(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-emerald-900 text-white min-h-screen p-4 flex flex-col fixed z-10">
        <div className="mb-8 p-2">
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2"><Activity/> Perawat Panel</h2>
          <p className="text-emerald-200 text-sm mt-1">{user?.nama}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-800 text-white">
            <ClipboardList className="h-5 w-5" /> Tugas & Jadwal
          </div>
        </nav>
        <div className="mt-auto space-y-2">
          <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-4 py-3 text-emerald-200 hover:bg-emerald-800 rounded-lg transition">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} 
            {isDarkMode ? 'Tema Terang' : 'Tema Gelap'}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/40 rounded-lg transition mt-auto w-full">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 dark:text-slate-100">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Daftar Tugas Pasien</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Daftar pasien rawat inap, jalan, dan operasi yang ditugaskan kepada Anda.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jadwal.map((j) => (
            <div key={j.kd_pendaftaran} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition">
              <div className={`p-4 border-b dark:border-slate-700 ${
                j.jenis_perawatan === 'Rawat Inap' ? 'bg-blue-50 dark:bg-blue-900/20' :
                j.jenis_perawatan === 'Operasi' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800 dark:text-white">{j.nama_pasien}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${j.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {j.status}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{j.jenis_perawatan} - {j.nama_poli}</div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Waktu:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(j.tanggal_jadwal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Ruangan:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{j.nama_ruangan || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Dokter:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{j.nama_dokter || '-'}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Keterangan:</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{j.keterangan}</p>
                </div>
              </div>
            </div>
          ))}
          {jadwal.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <ClipboardList className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p>Tidak ada tugas pasien saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;

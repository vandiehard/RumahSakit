import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, ClipboardList, Activity } from 'lucide-react';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jadwal, setJadwal] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.jabatan !== 'Perawat') {
      navigate('/login');
    } else {
      setUser(userData);
      fetchJadwal(userData.id);
    }
  }, [navigate]);

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-emerald-900 text-white min-h-screen p-4 flex flex-col fixed">
        <div className="mb-8 p-2">
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2"><Activity/> Perawat Panel</h2>
          <p className="text-emerald-200 text-sm mt-1">{user?.nama}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-800 text-white">
            <ClipboardList className="h-5 w-5" /> Tugas & Jadwal
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/40 rounded-lg transition mt-auto">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Daftar Tugas Pasien</h1>
          <p className="text-slate-600 mt-2">Daftar pasien rawat inap, jalan, dan operasi yang ditugaskan kepada Anda.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jadwal.map((j) => (
            <div key={j.kd_pendaftaran} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className={`p-4 border-b ${
                j.jenis_perawatan === 'Rawat Inap' ? 'bg-blue-50 border-blue-100' :
                j.jenis_perawatan === 'Operasi' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800">{j.nama_pasien}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${j.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {j.status}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-700">{j.jenis_perawatan} - {j.nama_poli}</div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Waktu:</span>
                  <span className="font-medium text-slate-800">{new Date(j.tanggal_jadwal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Ruangan:</span>
                  <span className="font-medium text-slate-800">{j.nama_ruangan || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Dokter:</span>
                  <span className="font-medium text-slate-800">{j.nama_dokter || '-'}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <span className="text-slate-500 text-xs block mb-1">Keterangan:</span>
                  <p className="text-sm text-slate-700">{j.keterangan}</p>
                </div>
              </div>
            </div>
          ))}
          {jadwal.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
              <ClipboardList className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p>Tidak ada tugas pasien saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;

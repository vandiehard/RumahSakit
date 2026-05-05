import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, CalendarCheck, FileText, Pill, Plus, X, Sun, Moon, Activity, Scissors } from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  // Data Master
  const [daftarObat, setDaftarObat] = useState([]);
  const [daftarPenyakit, setDaftarPenyakit] = useState([]);
  const [daftarTindakan, setDaftarTindakan] = useState([]);

  // Form States
  const [catatan, setCatatan] = useState('');
  const [resep, setResep] = useState([]);
  const [selectedPenyakit, setSelectedPenyakit] = useState([]);
  const [selectedTindakan, setSelectedTindakan] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.jabatan !== 'Dokter') {
      navigate('/login');
    } else {
      setUser(userData);
      fetchJadwal(userData.id);
      fetchMasterData();
    }
  }, [navigate]);

  const fetchJadwal = async (id_dokter) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/dokter/jadwal/${id_dokter}`);
      setJadwal(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [resObat, resPenyakit, resTindakan] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/obat'),
        axios.get('http://localhost:5000/api/admin/penyakit'),
        axios.get('http://localhost:5000/api/admin/tindakan')
      ]);
      setDaftarObat(resObat.data.data);
      setDaftarPenyakit(resPenyakit.data.data);
      setDaftarTindakan(resTindakan.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const addObat = (e) => {
    const id = e.target.value;
    if (!id) return;
    const obat = daftarObat.find(o => o.kd_obat === parseInt(id));
    if (obat && !resep.find(r => r.kd_obat === obat.kd_obat)) {
      setResep([...resep, { ...obat, jumlah: 1 }]);
    }
    e.target.value = "";
  };

  const removeObat = (id) => {
    setResep(resep.filter(r => r.kd_obat !== id));
  };

  const updateJumlahObat = (id, jumlah) => {
    setResep(resep.map(r => r.kd_obat === id ? { ...r, jumlah: parseInt(jumlah) } : r));
  };

  const handleSelectPenyakit = (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    if (!selectedPenyakit.includes(id)) {
      setSelectedPenyakit([...selectedPenyakit, id]);
    }
    e.target.value = "";
  };

  const handleSelectTindakan = (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    if (!selectedTindakan.includes(id)) {
      setSelectedTindakan([...selectedTindakan, id]);
    }
    e.target.value = "";
  };

  const submitPemeriksaan = async () => {
    if (!catatan) return alert("Catatan medis harus diisi!");
    
    try {
      await axios.post('http://localhost:5000/api/dokter/resep', {
        kd_pendaftaran: selectedPasien.kd_pendaftaran,
        catatan,
        obat_list: resep.map(r => ({ kd_obat: r.kd_obat, jumlah: r.jumlah })),
        penyakit_list: selectedPenyakit,
        tindakan_list: selectedTindakan
      });
      alert('Pemeriksaan selesai!');
      setSelectedPasien(null);
      fetchJadwal(user.id);
    } catch (e) {
      alert('Terjadi kesalahan saat menyimpan data pemeriksaan.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white min-h-screen p-4 flex flex-col fixed z-10 border-r border-slate-800">
        <div className="mb-8 p-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">Dokter Panel</h2>
          <p className="text-blue-200 text-sm mt-1">{user?.nama}</p>
          <p className="text-xs text-blue-300 font-semibold">{user?.spesialisasi}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-800 text-white">
            <CalendarCheck className="h-5 w-5" /> Jadwal Pasien
          </div>
        </nav>
        <div className="mt-auto space-y-2">
          <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-4 py-3 text-blue-200 hover:bg-blue-800 rounded-lg transition">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} 
            {isDarkMode ? 'Tema Terang' : 'Tema Gelap'}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-900/40 rounded-lg transition mt-auto">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 flex flex-col lg:flex-row gap-8 dark:text-slate-100">
        <div className="flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Jadwal Pasien Anda</h1>
          </header>
          <div className="space-y-4">
            {jadwal.map((j) => (
              <div key={j.kd_pendaftaran} className={`bg-white dark:bg-slate-800 p-6 rounded-xl border transition ${selectedPasien?.kd_pendaftaran === j.kd_pendaftaran ? 'border-primary ring-2 ring-primary/20 dark:ring-blue-500/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{j.nama_pasien}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(j.tanggal_jadwal).toLocaleString('id-ID')} • Ruang: {j.nama_ruangan || '-'}</p>
                    <p className="text-sm mt-2 text-slate-700 dark:text-slate-300"><span className="font-semibold">Keluhan:</span> {j.keterangan}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${j.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {j.status}
                    </span>
                    {j.status !== 'Selesai' && (
                      <button 
                        onClick={() => { setSelectedPasien(j); setCatatan(''); setResep([]); setSelectedPenyakit([]); setSelectedTindakan([]); }}
                        className="block w-full mt-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Periksa Pasien
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {jadwal.length === 0 && <p className="text-slate-500 dark:text-slate-400">Tidak ada jadwal saat ini.</p>}
          </div>
        </div>

        {/* Examination Panel */}
        {selectedPasien && (
          <div className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-fit sticky top-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-white"><FileText className="h-5 w-5 text-primary"/> Form Pemeriksaan</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Pasien: <strong className="text-slate-800 dark:text-slate-200">{selectedPasien.nama_pasien}</strong></p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan Medis</label>
                <textarea 
                  rows="3" 
                  className="input-field resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                  placeholder="Tulis diagnosa dan catatan medis..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><Activity className="inline h-4 w-4 mr-1"/> Diagnosa Penyakit</label>
                <select className="input-field mb-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" onChange={handleSelectPenyakit}>
                  <option value="">+ Tambah Penyakit</option>
                  {daftarPenyakit.map(p => <option key={p.kd_penyakit} value={p.kd_penyakit}>{p.nama_penyakit}</option>)}
                </select>
                <div className="flex flex-wrap gap-2">
                  {selectedPenyakit.map(pid => {
                    const py = daftarPenyakit.find(p => p.kd_penyakit === pid);
                    return py ? (
                      <span key={pid} className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-red-200 dark:border-red-800">
                        {py.nama_penyakit} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPenyakit(selectedPenyakit.filter(id => id !== pid))}/>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><Scissors className="inline h-4 w-4 mr-1"/> Tindakan Medis</label>
                <select className="input-field mb-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" onChange={handleSelectTindakan}>
                  <option value="">+ Tambah Tindakan</option>
                  {daftarTindakan.map(t => <option key={t.kd_tindakan} value={t.kd_tindakan}>{t.nama_tindakan}</option>)}
                </select>
                <div className="flex flex-wrap gap-2">
                  {selectedTindakan.map(tid => {
                    const tn = daftarTindakan.find(t => t.kd_tindakan === tid);
                    return tn ? (
                      <span key={tid} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                        {tn.nama_tindakan} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedTindakan(selectedTindakan.filter(id => id !== tid))}/>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><Pill className="inline h-4 w-4 mr-1"/> Resep Obat</label>
                <select className="input-field text-sm mb-3 dark:bg-slate-700 dark:border-slate-600 dark:text-white" onChange={addObat}>
                  <option value="">+ Pilih Obat</option>
                  {daftarObat.map(o => <option key={o.kd_obat} value={o.kd_obat}>{o.nama_obat} ({o.stok} {o.satuan})</option>)}
                </select>
                
                {resep.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    {resep.map((r) => (
                      <div key={r.kd_obat} className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium flex-1 truncate dark:text-slate-300">{r.nama_obat}</span>
                        <input 
                          type="number" 
                          min="1" 
                          max={r.stok}
                          value={r.jumlah} 
                          onChange={(e) => updateJumlahObat(r.kd_obat, e.target.value)}
                          className="w-16 p-1 text-sm border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <button onClick={() => removeObat(r.kd_obat)} className="text-red-400 hover:text-red-600 p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={submitPemeriksaan} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3">
                Selesaikan Pemeriksaan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

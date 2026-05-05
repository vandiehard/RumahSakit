import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Calendar, Stethoscope, FileText, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [obatList, setObatList] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [resep, setResep] = useState([]); // [{kd_obat, jumlah, nama_obat}]

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.jabatan !== 'Dokter') {
      navigate('/login');
    } else {
      setUser(userData);
      fetchJadwal(userData.id);
      fetchObat();
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

  const fetchObat = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/obat');
      setObatList(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddObat = (e) => {
    const kd_obat = parseInt(e.target.value);
    if (!kd_obat) return;
    const obatDetail = obatList.find(o => o.kd_obat === kd_obat);
    if (!resep.find(r => r.kd_obat === kd_obat)) {
      setResep([...resep, { kd_obat, jumlah: 1, nama_obat: obatDetail.nama_obat }]);
    }
  };

  const handleUpdateJumlah = (kd_obat, jumlah) => {
    setResep(resep.map(r => r.kd_obat === kd_obat ? { ...r, jumlah: parseInt(jumlah) } : r));
  };

  const handleSubmitPemeriksaan = async () => {
    if (!selectedPasien) return;
    try {
      await axios.post('http://localhost:5000/api/dokter/resep', {
        kd_pendaftaran: selectedPasien.kd_pendaftaran,
        catatan,
        obat_list: resep
      });
      alert('Pemeriksaan berhasil disimpan!');
      setSelectedPasien(null);
      setCatatan('');
      setResep([]);
      fetchJadwal(user.id);
    } catch (e) {
      alert('Gagal menyimpan pemeriksaan');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white min-h-screen p-4 flex flex-col fixed">
        <div className="mb-8 p-2">
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2"><Stethoscope/> Dokter Panel</h2>
          <p className="text-indigo-200 text-sm mt-1">{user?.nama}</p>
          <p className="text-indigo-300 text-xs mt-1">Spesialis {user?.spesialisasi}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-800 text-white">
            <Calendar className="h-5 w-5" /> Jadwal Konsultasi
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/40 rounded-lg transition mt-auto">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 flex gap-8">
        <div className="flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Jadwal Pasien Anda</h1>
          </header>
          <div className="space-y-4">
            {jadwal.map((j) => (
              <div key={j.kd_pendaftaran} className={`bg-white p-6 rounded-xl border transition ${selectedPasien?.kd_pendaftaran === j.kd_pendaftaran ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{j.nama_pasien}</h3>
                    <p className="text-sm text-slate-500">{new Date(j.tanggal_jadwal).toLocaleString('id-ID')} • Ruang: {j.nama_ruangan || '-'}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Keluhan:</span> {j.keterangan}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${j.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {j.status}
                    </span>
                    {j.status !== 'Selesai' && (
                      <button 
                        onClick={() => { setSelectedPasien(j); setCatatan(''); setResep([]); }}
                        className="block w-full mt-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Periksa Pasien
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {jadwal.length === 0 && <p className="text-slate-500">Tidak ada jadwal saat ini.</p>}
          </div>
        </div>

        {/* Examination Panel */}
        {selectedPasien && (
          <div className="w-1/3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-fit sticky top-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800"><FileText className="h-5 w-5 text-primary"/> Form Pemeriksaan</h2>
            <p className="text-sm text-slate-600 mb-6">Pasien: <strong className="text-slate-800">{selectedPasien.nama_pasien}</strong></p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Medis</label>
                <textarea 
                  rows="4" 
                  className="input-field resize-none" 
                  placeholder="Tulis diagnosa dan catatan medis..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resep Obat</label>
                <select className="input-field mb-2" onChange={handleAddObat} value="">
                  <option value="">-- Tambah Obat --</option>
                  {obatList.filter(o => o.stok > 0).map(o => (
                    <option key={o.kd_obat} value={o.kd_obat}>{o.nama_obat} (Stok: {o.stok})</option>
                  ))}
                </select>
                
                {resep.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 mt-2">
                    {resep.map(r => (
                      <div key={r.kd_obat} className="flex justify-between items-center text-sm">
                        <span>{r.nama_obat}</span>
                        <input 
                          type="number" 
                          min="1" 
                          className="w-16 p-1 border rounded" 
                          value={r.jumlah}
                          onChange={(e) => handleUpdateJumlah(r.kd_obat, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={handleSubmitPemeriksaan}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
              >
                <CheckCircle className="h-5 w-5" /> Selesaikan Pemeriksaan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

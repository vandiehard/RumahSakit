import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Pill, Users, DoorOpen, Plus, Edit, X } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tugas'); // 'tugas', 'obat', 'ruangan'
  const [user, setUser] = useState(null);
  
  // Data states
  const [pendaftaran, setPendaftaran] = useState([]);
  const [obat, setObat] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [perawats, setPerawats] = useState([]);

  // Modal States
  const [modalType, setModalType] = useState(null); // 'tambah_obat', 'edit_stok', 'edit_ruangan', 'alert'
  const [modalData, setModalData] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.jabatan !== 'Admin') {
      navigate('/login');
    } else {
      setUser(userData);
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [resPend, resObat, resRuangan, resDokter, resPerawat] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/pendaftaran'),
        axios.get('http://localhost:5000/api/admin/obat'),
        axios.get('http://localhost:5000/api/admin/ruangan'),
        axios.get('http://localhost:5000/api/admin/pegawai/Dokter'),
        axios.get('http://localhost:5000/api/admin/pegawai/Perawat')
      ]);
      setPendaftaran(resPend.data.data);
      setObat(resObat.data.data);
      setRuangan(resRuangan.data.data);
      setDokters(resDokter.data.data);
      setPerawats(resPerawat.data.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setModalType('alert');
  };

  // Assign Task Handler
  const assignTask = async (id, doctorId, nurseId, roomId, currentStatus) => {
    if (!doctorId || !nurseId) return showAlert('Pilih dokter dan perawat terlebih dahulu!');
    try {
      await axios.put(`http://localhost:5000/api/admin/pendaftaran/${id}/assign`, {
        id_dokter: doctorId,
        id_perawat: nurseId,
        kd_ruangan: roomId || null,
        status: currentStatus === 'Menunggu' ? 'Dijadwalkan' : currentStatus
      });
      showAlert('Tugas berhasil diberikan!');
      fetchData();
    } catch (e) {
      showAlert('Gagal memberikan tugas');
    }
  };

  const submitTambahObat = async (e) => {
    e.preventDefault();
    const { nama_obat, satuan, stok, keterangan } = modalData;
    try {
      await axios.post('http://localhost:5000/api/admin/obat', { nama_obat, satuan, stok: parseInt(stok), keterangan });
      showAlert("Obat berhasil ditambahkan!");
      setModalType(null);
      fetchData();
    } catch (e) {
      showAlert("Gagal menambahkan obat");
    }
  };

  const submitUpdateStok = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/obat/${modalData.id}`, { stok: parseInt(modalData.stok) });
      showAlert("Stok berhasil diperbarui!");
      setModalType(null);
      fetchData();
    } catch (e) {
      showAlert("Gagal memperbarui stok");
    }
  };

  const submitUpdateRuangan = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/ruangan/${modalData.id}`, { status_ruangan: modalData.status });
      showAlert("Status ruangan berhasil diperbarui!");
      setModalType(null);
      fetchData();
    } catch (e) {
      showAlert("Gagal memperbarui status ruangan");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex dark:bg-slate-900 transition-colors duration-300 relative">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col fixed border-r border-slate-800">
        <div className="mb-8 p-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">Admin Panel</h2>
          <p className="text-slate-400 text-sm mt-1">{user?.nama}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('tugas')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'tugas' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Users className="h-5 w-5" /> Distribusi Tugas
          </button>
          <button 
            onClick={() => setActiveTab('obat')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'obat' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Pill className="h-5 w-5" /> Manajemen Obat
          </button>
          <button 
            onClick={() => setActiveTab('ruangan')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'ruangan' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <DoorOpen className="h-5 w-5" /> Audit Ruangan
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg transition mt-auto">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 dark:text-slate-100">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white capitalize">{activeTab.replace('_', ' ')}</h1>
        </header>

        {activeTab === 'tugas' && (
          <div className="card-container overflow-x-auto dark:bg-slate-800 dark:border-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">Pasien</th>
                  <th className="p-3">Poli & Perawatan</th>
                  <th className="p-3">Jadwal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tugaskan (Dokter | Perawat | Ruang)</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendaftaran.map((p) => (
                  <tr key={p.kd_pendaftaran} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="p-3 font-medium">{p.nama_pasien}</td>
                    <td className="p-3">
                      <div className="text-sm font-semibold">{p.nama_poli}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{p.jenis_perawatan}</div>
                    </td>
                    <td className="p-3 text-sm">{new Date(p.tanggal_jadwal).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-sm font-bold">{p.status}</td>
                    <td className="p-3 space-y-2">
                      <select 
                        className="input-field text-sm p-1 dark:bg-slate-700 dark:border-slate-600" 
                        defaultValue={p.id_dokter || ""}
                        id={`dok-${p.kd_pendaftaran}`}
                      >
                        <option value="">-- Pilih Dokter --</option>
                        {dokters.map(d => <option key={d.id_pegawai} value={d.id_pegawai}>{d.nama} ({d.spesialisasi})</option>)}
                      </select>
                      <select 
                        className="input-field text-sm p-1 dark:bg-slate-700 dark:border-slate-600" 
                        defaultValue={p.id_perawat || ""}
                        id={`per-${p.kd_pendaftaran}`}
                      >
                        <option value="">-- Pilih Perawat --</option>
                        {perawats.map(pr => <option key={pr.id_pegawai} value={pr.id_pegawai}>{pr.nama}</option>)}
                      </select>
                      <select 
                        className="input-field text-sm p-1 dark:bg-slate-700 dark:border-slate-600" 
                        defaultValue={p.kd_ruangan || ""}
                        id={`rua-${p.kd_pendaftaran}`}
                      >
                        <option value="">-- Pilih Ruang --</option>
                        {ruangan.filter(r => r.status_ruangan === 'Tersedia' || r.kd_ruangan === p.kd_ruangan).map(r => 
                          <option key={r.kd_ruangan} value={r.kd_ruangan}>{r.nama_ruangan} ({r.fungsi})</option>
                        )}
                      </select>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => assignTask(
                          p.kd_pendaftaran,
                          document.getElementById(`dok-${p.kd_pendaftaran}`).value,
                          document.getElementById(`per-${p.kd_pendaftaran}`).value,
                          document.getElementById(`rua-${p.kd_pendaftaran}`).value,
                          p.status
                        )}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary transition"
                      >
                        Simpan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'obat' && (
          <div className="card-container dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Stok Obat</h3>
              <button 
                onClick={() => { setModalData({ nama_obat: '', satuan: 'Tablet', stok: 100, keterangan: '-' }); setModalType('tambah_obat'); }} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Plus className="h-4 w-4" /> Tambah Obat Baru
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">Nama Obat</th>
                  <th className="p-3">Satuan</th>
                  <th className="p-3">Stok</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {obat.map((o) => (
                  <tr key={o.kd_obat} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="p-3 font-medium">{o.nama_obat}</td>
                    <td className="p-3">{o.satuan}</td>
                    <td className="p-3 font-bold text-primary dark:text-blue-400">{o.stok}</td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-400">{o.keterangan}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => { setModalData({ id: o.kd_obat, stok: o.stok, nama_obat: o.nama_obat }); setModalType('edit_stok'); }} 
                        className="text-primary dark:text-blue-400 hover:text-secondary dark:hover:text-blue-300 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition" 
                        title="Update Stok"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ruangan' && (
          <div className="grid md:grid-cols-3 gap-6">
            {ruangan.map(r => (
              <div key={r.kd_ruangan} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{r.nama_ruangan}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    r.status_ruangan === 'Tersedia' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    r.status_ruangan === 'Digunakan' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {r.status_ruangan}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Fungsi: {r.fungsi}</p>
                <button 
                  onClick={() => { setModalData({ id: r.kd_ruangan, status: r.status_ruangan, nama_ruangan: r.nama_ruangan }); setModalType('edit_ruangan'); }} 
                  className="mt-auto border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Ubah Status
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
              <X className="h-6 w-6" />
            </button>
            
            {modalType === 'alert' && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Informasi</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{alertMessage}</p>
                <button onClick={() => setModalType(null)} className="btn-primary w-full">Tutup</button>
              </div>
            )}

            {modalType === 'tambah_obat' && (
              <form onSubmit={submitTambahObat}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Tambah Obat Baru</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Nama Obat" required className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={modalData.nama_obat} onChange={e => setModalData({...modalData, nama_obat: e.target.value})} />
                  <select required className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={modalData.satuan} onChange={e => setModalData({...modalData, satuan: e.target.value})}>
                    <option value="Tablet">Tablet</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Botol">Botol</option>
                    <option value="Salep">Salep</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                  <input type="number" placeholder="Stok Awal" required min="0" className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={modalData.stok} onChange={e => setModalData({...modalData, stok: e.target.value})} />
                  <textarea placeholder="Keterangan (Opsional)" className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={modalData.keterangan} onChange={e => setModalData({...modalData, keterangan: e.target.value})} />
                  <button type="submit" className="btn-primary w-full">Simpan Obat</button>
                </div>
              </form>
            )}

            {modalType === 'edit_stok' && (
              <form onSubmit={submitUpdateStok}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Update Stok Obat</h3>
                <p className="text-slate-500 text-sm mb-4">Obat: {modalData.nama_obat}</p>
                <div className="space-y-4">
                  <input type="number" placeholder="Jumlah Stok" required min="0" className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={modalData.stok} onChange={e => setModalData({...modalData, stok: e.target.value})} />
                  <button type="submit" className="btn-primary w-full">Perbarui Stok</button>
                </div>
              </form>
            )}

            {modalType === 'edit_ruangan' && (
              <form onSubmit={submitUpdateRuangan}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Ubah Status Ruangan</h3>
                <p className="text-slate-500 text-sm mb-4">Ruangan: {modalData.nama_ruangan}</p>
                <div className="space-y-4">
                  <select required className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={modalData.status} onChange={e => setModalData({...modalData, status: e.target.value})}>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Digunakan">Digunakan</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                  <button type="submit" className="btn-primary w-full">Perbarui Status</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

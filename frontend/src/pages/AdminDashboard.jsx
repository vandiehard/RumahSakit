import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  Pill,
  Users,
  DoorOpen,
  Plus,
  Edit,
  X,
  Activity,
  Scissors,
  CreditCard,
  Sun,
  Moon,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tugas"); // 'tugas', 'obat', 'ruangan', 'penyakit', 'tindakan', 'pembayaran'
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const theme = localStorage.getItem("theme");
      return (
        theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    } catch (e) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });

  // Data states
  const [pendaftaran, setPendaftaran] = useState([]);
  const [obat, setObat] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [perawats, setPerawats] = useState([]);
  const [penyakit, setPenyakit] = useState([]);
  const [tindakan, setTindakan] = useState([]);
  const [pembayaran, setPembayaran] = useState([]);
  const [pasiens, setPasiens] = useState([]);

  // Modal States
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [assignStaffModal, setAssignStaffModal] = useState(null); // { staff, role }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || userData.jabatan !== "Admin") {
      navigate("/login");
    } else {
      setUser(userData);
      fetchData();
    }
  }, [navigate]);

  const toggleTheme = () => {
    const willBeDark = !document.documentElement.classList.contains("dark");
    if (willBeDark) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {}
    }
  };

  const fetchData = async () => {
    try {
      const [
        resPend,
        resObat,
        resRuangan,
        resDokter,
        resPerawat,
        resPenyakit,
        resTindakan,
        resPembayaran,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/pendaftaran"),
        axios.get("http://localhost:5000/api/admin/obat"),
        axios.get("http://localhost:5000/api/admin/ruangan"),
        axios.get("http://localhost:5000/api/admin/pegawai/Dokter"),
        axios.get("http://localhost:5000/api/admin/pegawai/Perawat"),
        axios.get("http://localhost:5000/api/admin/penyakit"),
        axios.get("http://localhost:5000/api/admin/tindakan"),
        axios.get("http://localhost:5000/api/admin/pembayaran"),
      ]);
      setPendaftaran(resPend.data.data);
      setObat(resObat.data.data);
      setRuangan(resRuangan.data.data);
      setDokters(resDokter.data.data);
      setPerawats(resPerawat.data.data);
      setPenyakit(resPenyakit.data.data);
      setTindakan(resTindakan.data.data);
      setPembayaran(resPembayaran.data.data);

      // Derive pasiens from pendaftaran
      const uniquePasiens = [];
      const seen = new Set();
      (resPend.data.data || []).forEach(p => {
        if (!seen.has(p.id_pasien)) {
          seen.add(p.id_pasien);
          uniquePasiens.push({ id_pasien: p.id_pasien, nama: p.nama_pasien });
        }
      });
      setPasiens(uniquePasiens);
    } catch (error) {
      console.error("Error fetching admin data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setModalType("alert");
  };

  // Assign Task Handler
  const assignTask = async (id, doctorId, nurseId, roomId, currentStatus) => {
    if (!doctorId || !nurseId)
      return showAlert("Pilih dokter dan perawat terlebih dahulu!");
    try {
      await axios.put(
        `http://localhost:5000/api/admin/pendaftaran/${id}/assign`,
        {
          id_dokter: doctorId,
          id_perawat: nurseId,
          kd_ruangan: roomId || null,
          status: currentStatus === "Menunggu" ? "Dijadwalkan" : currentStatus,
        },
      );
      showAlert("Tugas berhasil diberikan!");
      fetchData();
    } catch (e) {
      showAlert("Gagal memberikan tugas");
    }
  };

  // Assign staff directly from the Staff Panel
  const submitAssignFromStaff = async (e) => {
    e.preventDefault();
    const { staff, role, kd_pendaftaran, kd_ruangan } = assignStaffModal;
    if (!kd_pendaftaran) return showAlert("Pilih pasien terlebih dahulu!");

    const pendTarget = pendaftaran.find(p => p.kd_pendaftaran === parseInt(kd_pendaftaran));
    if (!pendTarget) return showAlert("Data pendaftaran tidak ditemukan.");

    const payload = {
      id_dokter: role === 'Dokter' ? staff.id_pegawai : (pendTarget.id_dokter || null),
      id_perawat: role === 'Perawat' ? staff.id_pegawai : (pendTarget.id_perawat || null),
      kd_ruangan: kd_ruangan || pendTarget.kd_ruangan || null,
      status: pendTarget.status === 'Menunggu' ? 'Dijadwalkan' : pendTarget.status,
    };

    try {
      await axios.put(`http://localhost:5000/api/admin/pendaftaran/${kd_pendaftaran}/assign`, payload);
      setAssignStaffModal(null);
      showAlert(`${role} berhasil ditugaskan ke pasien!`);
      fetchData();
    } catch (err) {
      showAlert("Gagal memberikan tugas.");
    }
  };

  const submitForm = async (e, endpoint, payload, successMsg) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/admin/${endpoint}`, payload);
      showAlert(successMsg);
      setModalType(null);
      fetchData();
    } catch (e) {
      showAlert("Gagal memproses data");
    }
  };

  const submitUpdateStok = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/obat/${modalData.id}`, {
        stok: parseInt(modalData.stok),
      });
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
      await axios.put(
        `http://localhost:5000/api/admin/ruangan/${modalData.id}`,
        { status_ruangan: modalData.status },
      );
      showAlert("Status ruangan berhasil diperbarui!");
      setModalType(null);
      fetchData();
    } catch (e) {
      showAlert("Gagal memperbarui status ruangan");
    }
  };

  const submitUpdatePembayaran = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/admin/pembayaran/${modalData.id}`,
        { keterangan: modalData.keterangan },
      );
      showAlert("Status pembayaran berhasil diperbarui!");
      setModalType(null);
      fetchData();
    } catch (e) {
      showAlert("Gagal memperbarui pembayaran");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex dark:bg-slate-900 transition-colors duration-300 relative">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col fixed border-r border-slate-800 z-10 overflow-y-auto">
        <div className="mb-6 p-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Admin Panel
          </h2>
          <p className="text-slate-400 text-sm mt-1">{user?.nama}</p>
        </div>
        <nav className="flex-1 space-y-2 mb-6">
          <button
            onClick={() => setActiveTab("tugas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "tugas" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <Users className="h-5 w-5" /> Distribusi Tugas
          </button>
          <button
            onClick={() => setActiveTab("pembayaran")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "pembayaran" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <CreditCard className="h-5 w-5" /> Pembayaran
          </button>
          <button
            onClick={() => setActiveTab("obat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "obat" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <Pill className="h-5 w-5" /> Manajemen Obat
          </button>
          <button
            onClick={() => setActiveTab("penyakit")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "penyakit" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <Activity className="h-5 w-5" /> Penyakit
          </button>
          <button
            onClick={() => setActiveTab("tindakan")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "tindakan" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <Scissors className="h-5 w-5" /> Tindakan Medis
          </button>
          <button
            onClick={() => setActiveTab("ruangan")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "ruangan" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <DoorOpen className="h-5 w-5" /> Audit Ruangan
          </button>
        </nav>

        <div className="mt-auto space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            {isDarkMode ? "Tema Terang" : "Tema Gelap"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 dark:text-slate-100">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white capitalize">
            {activeTab.replace("_", " ")}
          </h1>
        </header>

        {activeTab === "tugas" && (
          <>
            <div className="card-container overflow-x-auto dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Daftar Penugasan Pasien
              </h3>
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
                    <tr
                      key={p.kd_pendaftaran}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-3 font-medium">{p.nama_pasien}</td>
                      <td className="p-3">
                        <div className="text-sm font-semibold">
                          {p.nama_poli}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {p.jenis_perawatan}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(p.tanggal_jadwal).toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-sm font-bold">{p.status}</td>
                      <td className="p-3 space-y-2">
                        <select
                          className="input-field text-sm p-1 dark:bg-slate-700 dark:border-slate-600"
                          defaultValue={p.id_dokter || ""}
                          id={`dok-${p.kd_pendaftaran}`}
                        >
                          <option value="">-- Pilih Dokter --</option>
                          {dokters.map((d) => {
                            const isBusy = pendaftaran.some(
                              (pt) =>
                                pt.id_dokter === d.id_pegawai &&
                                pt.status !== "Selesai" &&
                                pt.kd_pendaftaran !== p.kd_pendaftaran,
                            );
                            return (
                              <option
                                key={d.id_pegawai}
                                value={d.id_pegawai}
                                disabled={isBusy}
                              >
                                {d.nama} ({d.spesialisasi}){" "}
                                {isBusy ? "- Not Available" : "- Available"}
                              </option>
                            );
                          })}
                        </select>
                        <select
                          className="input-field text-sm p-1 dark:bg-slate-700 dark:border-slate-600"
                          defaultValue={p.id_perawat || ""}
                          id={`per-${p.kd_pendaftaran}`}
                        >
                          <option value="">-- Pilih Perawat --</option>
                          {perawats.map((pr) => {
                            const isBusy = pendaftaran.some(
                              (pt) =>
                                pt.id_perawat === pr.id_pegawai &&
                                pt.status !== "Selesai" &&
                                pt.kd_pendaftaran !== p.kd_pendaftaran,
                            );
                            return (
                              <option
                                key={pr.id_pegawai}
                                value={pr.id_pegawai}
                                disabled={isBusy}
                              >
                                {pr.nama}{" "}
                                {isBusy ? "- Not Available" : "- Available"}
                              </option>
                            );
                          })}
                        </select>
                        <select
                          className="input-field text-sm p-1 dark:bg-slate-700 dark:border-slate-600"
                          defaultValue={p.kd_ruangan || ""}
                          id={`rua-${p.kd_pendaftaran}`}
                        >
                          <option value="">-- Pilih Ruang --</option>
                          {ruangan
                            .filter(
                              (r) =>
                                r.status_ruangan === "Tersedia" ||
                                r.kd_ruangan === p.kd_ruangan,
                            )
                            .map((r) => (
                              <option key={r.kd_ruangan} value={r.kd_ruangan}>
                                {r.nama_ruangan} ({r.fungsi})
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            assignTask(
                              p.kd_pendaftaran,
                              document.getElementById(`dok-${p.kd_pendaftaran}`)
                                .value,
                              document.getElementById(`per-${p.kd_pendaftaran}`)
                                .value,
                              document.getElementById(`rua-${p.kd_pendaftaran}`)
                                .value,
                              p.status,
                            )
                          }
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

            <div className="mt-8 mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Status Ketersediaan Pegawai Medis
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Dokter Panel */}
                <div className="card-container dark:bg-slate-800 dark:border-slate-700">
                  <h4 className="font-semibold text-lg text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b dark:border-slate-700 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" /> Dokter
                  </h4>
                  <div className="space-y-3">
                    {dokters.map((d) => {
                      const activeTasks = pendaftaran.filter(pt => pt.id_dokter === d.id_pegawai && pt.status !== 'Selesai');
                      const isBusy = activeTasks.length > 0;
                      return (
                        <div key={d.id_pegawai} className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          isBusy ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/50 hover:shadow-sm'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white truncate">Dr. {d.nama}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{d.spesialisasi}</p>
                            {isBusy && activeTasks[0] && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1 truncate">
                                ▶ {activeTasks[0].nama_pasien} — {activeTasks[0].status}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              !isBusy ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {!isBusy ? '✓ Available' : '✗ Busy'}
                            </span>
                            {!isBusy && (
                              <button
                                onClick={() => setAssignStaffModal({ staff: d, role: 'Dokter', kd_pendaftaran: '', kd_ruangan: '' })}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" /> Tugaskan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Perawat Panel */}
                <div className="card-container dark:bg-slate-800 dark:border-slate-700">
                  <h4 className="font-semibold text-lg text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b dark:border-slate-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" /> Perawat
                  </h4>
                  <div className="space-y-3">
                    {perawats.map((pr) => {
                      const activeTasks = pendaftaran.filter(pt => pt.id_perawat === pr.id_pegawai && pt.status !== 'Selesai');
                      const isBusy = activeTasks.length > 0;
                      return (
                        <div key={pr.id_pegawai} className={`flex items-center justify-between p-3 rounded-xl border transition ${
                          isBusy ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/50 hover:shadow-sm'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white truncate">{pr.nama}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Perawat</p>
                            {isBusy && activeTasks[0] && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1 truncate">
                                ▶ {activeTasks[0].nama_pasien} — {activeTasks[0].status}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              !isBusy ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {!isBusy ? '✓ Available' : '✗ Busy'}
                            </span>
                            {!isBusy && (
                              <button
                                onClick={() => setAssignStaffModal({ staff: pr, role: 'Perawat', kd_pendaftaran: '', kd_ruangan: '' })}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" /> Tugaskan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          {/* Assign Staff Modal */}
          {assignStaffModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <button onClick={() => setAssignStaffModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"><X className="h-5 w-5" /></button>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Tugaskan {assignStaffModal.role}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {assignStaffModal.role === 'Dokter' ? `Dr. ${assignStaffModal.staff.nama}` : assignStaffModal.staff.nama} → Pilih pasien & ruangan
                </p>
                <form onSubmit={submitAssignFromStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pasien (Pendaftaran)</label>
                    <select
                      required
                      className="input-field dark:bg-slate-700 dark:border-slate-600"
                      value={assignStaffModal.kd_pendaftaran}
                      onChange={e => setAssignStaffModal(prev => ({ ...prev, kd_pendaftaran: e.target.value }))}
                    >
                      <option value="">-- Pilih Pasien --</option>
                      {pendaftaran
                        .filter(p => p.status === 'Menunggu' && (
                          assignStaffModal.role === 'Dokter' ? !p.id_dokter : !p.id_perawat
                        ))
                        .map(p => (
                          <option key={p.kd_pendaftaran} value={p.kd_pendaftaran}>
                            {p.nama_pasien} — {p.nama_poli}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ruangan (Opsional)</label>
                    <select
                      className="input-field dark:bg-slate-700 dark:border-slate-600"
                      value={assignStaffModal.kd_ruangan}
                      onChange={e => setAssignStaffModal(prev => ({ ...prev, kd_ruangan: e.target.value }))}
                    >
                      <option value="">-- Pilih Ruangan --</option>
                      {ruangan.filter(r => r.status_ruangan === 'Tersedia').map(r => (
                        <option key={r.kd_ruangan} value={r.kd_ruangan}>{r.nama_ruangan} ({r.fungsi})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg transition">Tugaskan Sekarang</button>
                    <button type="button" onClick={() => setAssignStaffModal(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 rounded-lg transition">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </>
        )}

        {activeTab === "pembayaran" && (
          <div className="card-container dark:bg-slate-800 dark:border-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Pasien</th>
                  <th className="p-3">Total Biaya</th>
                  <th className="p-3">Status/Ket</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pembayaran.map((p) => (
                  <tr
                    key={p.kd_pembayaran}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-3 text-sm">
                      {new Date(p.tanggal).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 font-medium">{p.nama_pasien}</td>
                    <td className="p-3 font-bold text-primary dark:text-blue-400">
                      Rp {p.total.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-400">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${p.keterangan === "Lunas" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                      >
                        {p.keterangan}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setModalData({
                            id: p.kd_pembayaran,
                            keterangan: p.keterangan,
                          });
                          setModalType("edit_pembayaran");
                        }}
                        className="text-primary dark:text-blue-400 hover:text-secondary p-2 transition"
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

        {activeTab === "obat" && (
          <div className="card-container dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Stok Obat</h3>
              <button
                onClick={() => {
                  setModalData({
                    nama_obat: "",
                    satuan: "Tablet",
                    stok: 100,
                    keterangan: "-",
                  });
                  setModalType("tambah_obat");
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Plus className="h-4 w-4" /> Tambah Obat
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
                  <tr
                    key={o.kd_obat}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-3 font-medium">{o.nama_obat}</td>
                    <td className="p-3">{o.satuan}</td>
                    <td className="p-3 font-bold text-primary dark:text-blue-400">
                      {o.stok}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-400">
                      {o.keterangan}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setModalData({
                            id: o.kd_obat,
                            stok: o.stok,
                            nama_obat: o.nama_obat,
                          });
                          setModalType("edit_stok");
                        }}
                        className="text-primary dark:text-blue-400 hover:text-secondary p-2 transition"
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

        {activeTab === "penyakit" && (
          <div className="card-container dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Daftar Penyakit</h3>
              <button
                onClick={() => {
                  setModalData({ nama_penyakit: "", keterangan: "" });
                  setModalType("tambah_penyakit");
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Plus className="h-4 w-4" /> Tambah Penyakit
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">Nama Penyakit</th>
                  <th className="p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {penyakit.map((p) => (
                  <tr
                    key={p.kd_penyakit}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-3 font-medium">{p.nama_penyakit}</td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-400">
                      {p.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tindakan" && (
          <div className="card-container dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tindakan Medis</h3>
              <button
                onClick={() => {
                  setModalData({ nama_tindakan: "", harga: 0 });
                  setModalType("tambah_tindakan");
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Plus className="h-4 w-4" /> Tambah Tindakan
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">Nama Tindakan</th>
                  <th className="p-3">Harga</th>
                </tr>
              </thead>
              <tbody>
                {tindakan.map((t) => (
                  <tr
                    key={t.kd_tindakan}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-3 font-medium">{t.nama_tindakan}</td>
                    <td className="p-3 text-primary dark:text-blue-400 font-bold">
                      Rp {t.harga.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "ruangan" && (
          <div className="grid md:grid-cols-3 gap-6">
            {ruangan.map((r) => (
              <div
                key={r.kd_ruangan}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {r.nama_ruangan}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${r.status_ruangan === "Tersedia" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : r.status_ruangan === "Digunakan" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"}`}
                  >
                    {r.status_ruangan}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  Fungsi: {r.fungsi}
                </p>
                <button
                  onClick={() => {
                    setModalData({
                      id: r.kd_ruangan,
                      status: r.status_ruangan,
                      nama_ruangan: r.nama_ruangan,
                    });
                    setModalType("edit_ruangan");
                  }}
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
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
            >
              <X className="h-6 w-6" />
            </button>

            {modalType === "alert" && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Informasi
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {alertMessage}
                </p>
                <button
                  onClick={() => setModalType(null)}
                  className="btn-primary w-full"
                >
                  Tutup
                </button>
              </div>
            )}

            {modalType === "tambah_obat" && (
              <form
                onSubmit={(e) =>
                  submitForm(
                    e,
                    "obat",
                    {
                      nama_obat: modalData.nama_obat,
                      satuan: modalData.satuan,
                      stok: parseInt(modalData.stok),
                      keterangan: modalData.keterangan,
                    },
                    "Obat ditambahkan!",
                  )
                }
              >
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Tambah Obat Baru
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Obat"
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.nama_obat}
                    onChange={(e) =>
                      setModalData({ ...modalData, nama_obat: e.target.value })
                    }
                  />
                  <select
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.satuan}
                    onChange={(e) =>
                      setModalData({ ...modalData, satuan: e.target.value })
                    }
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Botol">Botol</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Stok"
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.stok}
                    onChange={(e) =>
                      setModalData({ ...modalData, stok: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Keterangan"
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.keterangan}
                    onChange={(e) =>
                      setModalData({ ...modalData, keterangan: e.target.value })
                    }
                  />
                  <button type="submit" className="btn-primary w-full">
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {modalType === "tambah_penyakit" && (
              <form
                onSubmit={(e) =>
                  submitForm(
                    e,
                    "penyakit",
                    {
                      nama_penyakit: modalData.nama_penyakit,
                      keterangan: modalData.keterangan,
                    },
                    "Penyakit ditambahkan!",
                  )
                }
              >
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Tambah Penyakit
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Penyakit"
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.nama_penyakit}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        nama_penyakit: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Keterangan"
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.keterangan}
                    onChange={(e) =>
                      setModalData({ ...modalData, keterangan: e.target.value })
                    }
                  />
                  <button type="submit" className="btn-primary w-full">
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {modalType === "tambah_tindakan" && (
              <form
                onSubmit={(e) =>
                  submitForm(
                    e,
                    "tindakan",
                    {
                      nama_tindakan: modalData.nama_tindakan,
                      harga: modalData.harga,
                    },
                    "Tindakan ditambahkan!",
                  )
                }
              >
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Tambah Tindakan
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Tindakan"
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.nama_tindakan}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        nama_tindakan: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.harga}
                    onChange={(e) =>
                      setModalData({ ...modalData, harga: e.target.value })
                    }
                  />
                  <button type="submit" className="btn-primary w-full">
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {modalType === "edit_stok" && (
              <form onSubmit={submitUpdateStok}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  Update Stok Obat
                </h3>
                <p className="text-slate-500 mb-4">{modalData.nama_obat}</p>
                <div className="space-y-4">
                  <input
                    type="number"
                    required
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.stok}
                    onChange={(e) =>
                      setModalData({ ...modalData, stok: e.target.value })
                    }
                  />
                  <button type="submit" className="btn-primary w-full">
                    Update
                  </button>
                </div>
              </form>
            )}

            {modalType === "edit_ruangan" && (
              <form onSubmit={submitUpdateRuangan}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  Update Status Ruangan
                </h3>
                <p className="text-slate-500 mb-4">{modalData.nama_ruangan}</p>
                <div className="space-y-4">
                  <select
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.status}
                    onChange={(e) =>
                      setModalData({ ...modalData, status: e.target.value })
                    }
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Digunakan">Digunakan</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                  <button type="submit" className="btn-primary w-full">
                    Update
                  </button>
                </div>
              </form>
            )}

            {modalType === "edit_pembayaran" && (
              <form onSubmit={submitUpdatePembayaran}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  Update Status Pembayaran
                </h3>
                <div className="space-y-4 mt-4">
                  <select
                    className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={modalData.keterangan}
                    onChange={(e) =>
                      setModalData({ ...modalData, keterangan: e.target.value })
                    }
                  >
                    <option value="Belum Dibayar">Belum Dibayar</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                  <button type="submit" className="btn-primary w-full">
                    Update
                  </button>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, Activity, MapPin, Phone, Clock, Calendar, Users, HeartPulse, Sun, Moon, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sync local state with document class
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/jadwal_pasien');
        if (response.data.success) {
          setSchedules(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <HeartPulse className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight transition-colors">Klinik<span className="text-primary">Sehat</span></span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition">Tentang Kami</a>
              <a href="#services" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition">Layanan</a>
              <a href="#schedule" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition">Jadwal Pasien</a>
              <a href="#location" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition">Lokasi</a>
              
              {/* Dark Mode Toggle */}
              <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <Link to="/login" className="btn-primary">Login Pegawai</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 -z-10 transition-colors" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 transition-colors">
                Layanan Kesehatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Terbaik</span> Untuk Keluarga Anda
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed transition-colors">
                Kami memberikan pelayanan medis berkualitas tinggi dengan tenaga medis profesional dan fasilitas modern. Kesehatan Anda adalah prioritas utama kami.
              </p>
              <div className="flex gap-4">
                <a href="#services" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
                  Lihat Layanan <ArrowRight className="h-5 w-5" />
                </a>
                <a href="#schedule" className="bg-white dark:bg-slate-800 text-primary dark:text-blue-400 border border-primary hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold py-4 px-8 rounded-lg shadow-sm transition-colors">
                  Cek Jadwal
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hospital Building" className="rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* About & Features */}
      <section id="about" className="py-20 bg-white dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="card-container dark:bg-slate-700 dark:border-slate-600 hover:shadow-xl transition flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-6">
                <Stethoscope className="h-10 w-10 text-primary dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Dokter Spesialis</h3>
              <p className="text-slate-600 dark:text-slate-300">Tim dokter yang berpengalaman di berbagai bidang spesialisasi untuk menangani keluhan Anda.</p>
            </div>
            <div className="card-container dark:bg-slate-700 dark:border-slate-600 hover:shadow-xl transition flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-6">
                <Activity className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Fasilitas Modern</h3>
              <p className="text-slate-600 dark:text-slate-300">Dilengkapi dengan peralatan medis berteknologi mutakhir untuk diagnosis dan tindakan yang akurat.</p>
            </div>
            <div className="card-container dark:bg-slate-700 dark:border-slate-600 hover:shadow-xl transition flex flex-col items-center text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-6">
                <Users className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Pelayanan Ramah</h3>
              <p className="text-slate-600 dark:text-slate-300">Staf perawat dan administrasi kami siap melayani Anda dengan sepenuh hati 24 jam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Consultations */}
      <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">Layanan Konsultasi Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Poli Umum', 'Poli Gigi', 'Poli Bedah', 'Poli Anak'].map((poli, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:border-primary hover:shadow-md transform hover:-translate-y-2 transition duration-300">
                <h4 className="font-semibold text-xl text-slate-800 dark:text-white">{poli}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Schedule */}
      <section id="schedule" className="py-20 bg-white dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary dark:text-blue-400" />
              Jadwal Pasien Hari Ini
            </h2>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-blue-400 mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Memuat jadwal...</p>
              </div>
            ) : schedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                      <th className="p-4 rounded-tl-lg font-semibold">Nama Pasien (Inisial)</th>
                      <th className="p-4 font-semibold">Waktu Jadwal</th>
                      <th className="p-4 font-semibold">Poli</th>
                      <th className="p-4 font-semibold">Jenis Perawatan</th>
                      <th className="p-4 font-semibold">Ruangan</th>
                      <th className="p-4 rounded-tr-lg font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((sched, idx) => (
                      <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                        <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">
                          {/* Privacy: show partial name */}
                          {sched.nama_pasien.substring(0, 3)}***
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                          {new Date(sched.tanggal_jadwal).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{sched.nama_poli}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${sched.jenis_perawatan === 'Rawat Inap' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              sched.jenis_perawatan === 'Operasi' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {sched.jenis_perawatan}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{sched.nama_ruangan || '-'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${sched.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {sched.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                Tidak ada jadwal aktif saat ini.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location / Interactive Map */}
      <section id="location" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex justify-center items-center gap-3">
              <MapPin className="h-8 w-8 text-primary dark:text-blue-400" /> Lokasi Kami
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Kunjungi klinik kami di pusat kota dengan akses transportasi yang mudah.</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 h-[400px] w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.08643809619!2d106.741094!3d-6.2842065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15ab9e083c5%3A0xc07bd554fb7bb8!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer (Address) */}
      <footer className="bg-slate-900 dark:bg-black text-slate-300 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Klinik Sehat</h3>
            <p className="mb-6 max-w-sm">Memberikan pelayanan prima demi kesehatan masyarakat dengan dokter spesialis dan fasilitas terbaik.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Kontak & Alamat</h4>
            <div className="space-y-3">
              <p className="flex items-center gap-3 hover:text-white transition cursor-pointer"><MapPin className="h-5 w-5 text-primary" /> Jl. Kesehatan No. 123, Jakarta Selatan</p>
              <p className="flex items-center gap-3 hover:text-white transition cursor-pointer"><Phone className="h-5 w-5 text-primary" /> (021) 555-1234</p>
              <p className="flex items-center gap-3 hover:text-white transition cursor-pointer"><Clock className="h-5 w-5 text-primary" /> Buka 24 Jam Penuh</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Klinik Sehat. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

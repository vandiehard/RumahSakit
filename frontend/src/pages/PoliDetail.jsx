import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Stethoscope, HeartPulse, Activity, CheckCircle2 } from 'lucide-react';

const poliData = {
  umum: {
    title: 'Poli Umum',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
    description: 'Pelayanan kedokteran umum yang komprehensif untuk segala usia. Poli Umum kami adalah gerbang utama menuju kesehatan yang prima, menangani berbagai keluhan penyakit ringan hingga menengah, serta memberikan rujukan yang tepat jika diperlukan penanganan spesialis.',
    criteria: [
      'Pemeriksaan kesehatan rutin dan skrining',
      'Penanganan infeksi saluran pernapasan, demam, dan penyakit musiman',
      'Manajemen penyakit kronis seperti hipertensi dan diabetes ringan',
      'Konsultasi gaya hidup sehat dan pencegahan penyakit',
      'Pembuatan surat keterangan sehat'
    ],
    icon: <Stethoscope className="h-12 w-12 text-primary" />
  },
  gigi: {
    title: 'Poli Gigi',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    description: 'Perawatan kesehatan mulut dan gigi profesional. Dengan fasilitas modern dan dokter gigi spesialis, kami menawarkan perawatan mulai dari pencegahan, kosmetik, hingga restorasi gigi untuk memastikan senyum Anda selalu sehat dan cemerlang.',
    criteria: [
      'Pembersihan karang gigi (Scaling) dan pemutihan gigi',
      'Penambalan dan pencabutan gigi',
      'Perawatan saluran akar gigi',
      'Pemasangan kawat gigi (Ortodonti)',
      'Pembuatan gigi palsu dan implan'
    ],
    icon: <Activity className="h-12 w-12 text-blue-500" />
  },
  bedah: {
    title: 'Poli Bedah',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
    description: 'Pusat layanan bedah dengan teknologi terkini dan standar keselamatan tinggi. Tim bedah kami berpengalaman dalam berbagai prosedur pembedahan, baik operasi kecil maupun besar, dengan perawatan pasca-operasi yang intensif.',
    criteria: [
      'Bedah minor (pengangkatan benjolan, jahit luka)',
      'Bedah digestif (saluran pencernaan)',
      'Konsultasi pra-operasi dan perawatan pasca-operasi',
      'Penanganan trauma dan luka bakar',
      'Operasi laparoskopi minimal invasif'
    ],
    icon: <HeartPulse className="h-12 w-12 text-red-500" />
  },
  anak: {
    title: 'Poli Anak',
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=1200&q=80',
    description: 'Layanan kesehatan ramah anak dari bayi hingga remaja. Kami menciptakan lingkungan yang nyaman dan tidak menakutkan bagi anak-anak. Dokter spesialis anak kami siap memantau tumbuh kembang dan memberikan perawatan terbaik untuk si kecil.',
    criteria: [
      'Imunisasi dasar dan lanjutan',
      'Pemantauan tumbuh kembang dan gizi anak',
      'Penanganan penyakit umum pada bayi dan anak',
      'Konsultasi laktasi dan pola asuh',
      'Perawatan alergi dan asma pada anak'
    ],
    icon: <Stethoscope className="h-12 w-12 text-emerald-500" />
  }
};

const PoliDetail = () => {
  const { id } = useParams();
  const data = poliData[id?.toLowerCase()];

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Poli tidak ditemukan</h2>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
      {/* Navbar Minimalis */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary flex items-center gap-2 transition font-medium">
              <ArrowLeft className="w-5 h-5" /> Kembali
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in-up">
          {/* Hero Banner Poli */}
          <div className="relative h-[40vh] min-h-[300px]">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-8 md:p-12 w-full">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl inline-block mb-4">
                  {data.icon}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{data.title}</h1>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4 dark:border-slate-700">Tentang {data.title}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.description}
              </p>
              
              <div className="mt-10">
                <Link to="/" className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2">
                  Daftar Konsultasi
                </Link>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Layanan & Kriteria</h3>
              <ul className="space-y-4">
                {data.criteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliDetail;

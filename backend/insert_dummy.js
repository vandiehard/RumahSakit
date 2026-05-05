const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', database: 'rumah_sakit' });
  
  try {
    // Clean up existing dummy records to avoid duplicates
    await pool.query('DELETE FROM pembayaran');
    await pool.query('DELETE FROM detail_resep');
    await pool.query('DELETE FROM resep');
    await pool.query('DELETE FROM rekam_medis_tindakan');
    await pool.query('DELETE FROM rekam_medis_penyakit');
    await pool.query('DELETE FROM rekam_medis');
    await pool.query('DELETE FROM pendaftaran WHERE kd_pendaftaran >= 6');
    await pool.query('DELETE FROM tindakan');
    await pool.query('DELETE FROM penyakit');

    // Insert Penyakit & Tindakan
    await pool.query(`INSERT INTO penyakit (nama_penyakit, keterangan) VALUES 
      ('Demam Berdarah Dengue', 'Infeksi virus dengue yang ditularkan oleh nyamuk Aedes aegypti'),
      ('Tifus (Demam Tifoid)', 'Infeksi bakteri Salmonella typhi akibat makanan/minuman terkontaminasi'),
      ('Gastroenteritis', 'Infeksi saluran pencernaan (Muntaber)'),
      ('Hipertensi', 'Kondisi tekanan darah tinggi kronis'),
      ('Pulpitis', 'Peradangan pada pulpa gigi')`);
      
    await pool.query(`INSERT INTO tindakan (nama_tindakan, harga) VALUES 
      ('Konsultasi Dokter Umum', 150000),
      ('Konsultasi Dokter Spesialis', 250000),
      ('Cabut Gigi', 300000),
      ('Operasi Usus Buntu', 15000000),
      ('Pemeriksaan Darah Lengkap', 200000),
      ('Pemasangan Infus', 100000)`);

    // Fetch id_pasien 1 just in case 6 doesn't exist.
    const [pasien] = await pool.query('SELECT id_pasien FROM pasien LIMIT 1');
    const id_pasien = pasien[0].id_pasien;

    // Pendaftaran 6
    await pool.query(`INSERT INTO pendaftaran (kd_pendaftaran, id_pasien, kd_poli, tanggal_jadwal, jenis_perawatan, id_dokter, id_perawat, kd_ruangan, status, keterangan) VALUES 
      (6, ${id_pasien}, 1, '2026-05-01 08:30:00', 'Rawat Jalan', 2, 12, 7, 'Selesai', 'Pusing dan mual hebat')`);

    // Rekam Medis
    await pool.query(`INSERT INTO rekam_medis (kd_pemeriksaan, kd_pendaftaran, tanggal, catatan) VALUES
      (1, 6, '2026-05-01 09:00:00', 'Pasien mengalami dehidrasi ringan akibat muntaber, diberikan obat pereda mual dan antibiotik.')`);

    const [peny] = await pool.query('SELECT kd_penyakit FROM penyakit LIMIT 1');
    const [tind] = await pool.query('SELECT kd_tindakan FROM tindakan LIMIT 2');
    
    // Relasi
    await pool.query(`INSERT INTO rekam_medis_penyakit (kd_pemeriksaan, kd_penyakit) VALUES (1, ${peny[0].kd_penyakit})`);
    await pool.query(`INSERT INTO rekam_medis_tindakan (kd_pemeriksaan, kd_tindakan) VALUES (1, ${tind[0].kd_tindakan}), (1, ${tind[1].kd_tindakan})`);
    
    await pool.query(`INSERT INTO resep (kd_resep, kd_pemeriksaan, tanggal) VALUES (1, 1, '2026-05-01 09:15:00')`);
    await pool.query(`INSERT INTO detail_resep (kd_resep, kd_obat, jumlah) VALUES (1, 1, 10), (1, 3, 5)`);
    
    // Pembayaran
    await pool.query(`INSERT INTO pembayaran (kd_pemeriksaan, total, keterangan) VALUES (1, 250000, 'Belum Dibayar')`);
    
    // Another completed appointment
    await pool.query(`INSERT INTO pendaftaran (kd_pendaftaran, id_pasien, kd_poli, tanggal_jadwal, jenis_perawatan, id_dokter, id_perawat, kd_ruangan, status, keterangan) VALUES 
      (7, ${id_pasien}, 2, '2026-05-02 10:00:00', 'Rawat Jalan', 4, 13, 8, 'Selesai', 'Sakit gigi')`);
    await pool.query(`INSERT INTO rekam_medis (kd_pemeriksaan, kd_pendaftaran, tanggal, catatan) VALUES
      (2, 7, '2026-05-02 10:30:00', 'Gigi berlubang dicabut')`);
    await pool.query(`INSERT INTO rekam_medis_penyakit (kd_pemeriksaan, kd_penyakit) VALUES (2, ${peny[0].kd_penyakit})`);
    await pool.query(`INSERT INTO rekam_medis_tindakan (kd_pemeriksaan, kd_tindakan) VALUES (2, ${tind[0].kd_tindakan})`);
    await pool.query(`INSERT INTO pembayaran (kd_pemeriksaan, total, keterangan) VALUES (2, 450000, 'Lunas')`);

    console.log('Dummy Data Inserted!');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();

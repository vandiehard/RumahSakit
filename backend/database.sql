-- Database script for Hospital Management System

CREATE DATABASE IF NOT EXISTS rumah_sakit;
USE rumah_sakit;

CREATE TABLE pasien (
    id_pasien INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT,
    status VARCHAR(50),
    telepon VARCHAR(20)
);

CREATE TABLE pegawai (
    id_pegawai INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT,
    telepon VARCHAR(20),
    jabatan ENUM('Admin', 'Dokter', 'Perawat') NOT NULL,
    spesialisasi VARCHAR(50), -- e.g., 'Bedah', 'Umum', 'Gigi'
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE poli (
    kd_poli INT AUTO_INCREMENT PRIMARY KEY,
    nama_poli VARCHAR(100) NOT NULL,
    keterangan TEXT
);

CREATE TABLE ruangan (
    kd_ruangan INT AUTO_INCREMENT PRIMARY KEY,
    nama_ruangan VARCHAR(100) NOT NULL,
    fungsi VARCHAR(100) NOT NULL, -- e.g., 'ICU', 'Rawat Inap', 'Operasi'
    status_ruangan ENUM('Tersedia', 'Digunakan', 'Pemeliharaan') DEFAULT 'Tersedia'
);

CREATE TABLE pendaftaran (
    kd_pendaftaran INT AUTO_INCREMENT PRIMARY KEY,
    id_pasien INT NOT NULL,
    kd_poli INT NOT NULL,
    tanggal_jadwal DATETIME NOT NULL,
    jenis_perawatan ENUM('Rawat Inap', 'Rawat Jalan', 'Operasi') NOT NULL,
    id_dokter INT,
    id_perawat INT,
    kd_ruangan INT,
    status ENUM('Menunggu', 'Dijadwalkan', 'Selesai') DEFAULT 'Menunggu',
    keterangan TEXT,
    FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien),
    FOREIGN KEY (kd_poli) REFERENCES poli(kd_poli),
    FOREIGN KEY (id_dokter) REFERENCES pegawai(id_pegawai),
    FOREIGN KEY (id_perawat) REFERENCES pegawai(id_pegawai),
    FOREIGN KEY (kd_ruangan) REFERENCES ruangan(kd_ruangan)
);

CREATE TABLE rekam_medis (
    kd_pemeriksaan INT AUTO_INCREMENT PRIMARY KEY,
    kd_pendaftaran INT NOT NULL,
    tanggal DATETIME NOT NULL,
    catatan TEXT,
    FOREIGN KEY (kd_pendaftaran) REFERENCES pendaftaran(kd_pendaftaran)
);

CREATE TABLE penyakit (
    kd_penyakit INT AUTO_INCREMENT PRIMARY KEY,
    nama_penyakit VARCHAR(100) NOT NULL,
    keterangan TEXT
);

CREATE TABLE rekam_medis_penyakit (
    kd_pemeriksaan INT,
    kd_penyakit INT,
    PRIMARY KEY (kd_pemeriksaan, kd_penyakit),
    FOREIGN KEY (kd_pemeriksaan) REFERENCES rekam_medis(kd_pemeriksaan),
    FOREIGN KEY (kd_penyakit) REFERENCES penyakit(kd_penyakit)
);

CREATE TABLE tindakan (
    kd_tindakan INT AUTO_INCREMENT PRIMARY KEY,
    nama_tindakan VARCHAR(100) NOT NULL,
    harga DECIMAL(10, 2) NOT NULL
);

CREATE TABLE rekam_medis_tindakan (
    kd_pemeriksaan INT,
    kd_tindakan INT,
    PRIMARY KEY (kd_pemeriksaan, kd_tindakan),
    FOREIGN KEY (kd_pemeriksaan) REFERENCES rekam_medis(kd_pemeriksaan),
    FOREIGN KEY (kd_tindakan) REFERENCES tindakan(kd_tindakan)
);

CREATE TABLE obat (
    kd_obat INT AUTO_INCREMENT PRIMARY KEY,
    nama_obat VARCHAR(100) NOT NULL,
    satuan VARCHAR(50) NOT NULL,
    stok INT DEFAULT 0,
    keterangan TEXT
);

CREATE TABLE resep (
    kd_resep INT AUTO_INCREMENT PRIMARY KEY,
    kd_pemeriksaan INT NOT NULL,
    tanggal DATETIME NOT NULL,
    FOREIGN KEY (kd_pemeriksaan) REFERENCES rekam_medis(kd_pemeriksaan)
);

CREATE TABLE detail_resep (
    kd_resep INT,
    kd_obat INT,
    jumlah INT NOT NULL,
    PRIMARY KEY (kd_resep, kd_obat),
    FOREIGN KEY (kd_resep) REFERENCES resep(kd_resep),
    FOREIGN KEY (kd_obat) REFERENCES obat(kd_obat)
);

CREATE TABLE pembayaran (
    kd_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
    kd_pemeriksaan INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    keterangan TEXT,
    FOREIGN KEY (kd_pemeriksaan) REFERENCES rekam_medis(kd_pemeriksaan)
);

-- Dummy Data

INSERT INTO poli (nama_poli, keterangan) VALUES 
('Poli Umum', 'Melayani keluhan kesehatan umum'),
('Poli Gigi', 'Melayani kesehatan gigi dan mulut'),
('Poli Bedah', 'Melayani tindakan bedah minor dan mayor'),
('Poli Anak', 'Melayani kesehatan anak dan balita');

INSERT INTO pasien (nama, jenis_kelamin, tanggal_lahir, alamat, status, telepon) VALUES 
('Budi Santoso', 'L', '1980-05-12', 'Jl. Merdeka No 1', 'Menikah', '081234567890'),
('Siti Aminah', 'P', '1995-10-25', 'Jl. Sudirman No 5', 'Belum Menikah', '081234567891'),
('Agus Pratama', 'L', '1975-03-08', 'Jl. Thamrin No 12', 'Menikah', '081234567892'),
('Dewi Lestari', 'P', '1988-07-14', 'Jl. Gatot Subroto No 3', 'Menikah', '081234567893'),
('Rizky Maulana', 'L', '2000-12-01', 'Jl. Diponegoro No 8', 'Belum Menikah', '081234567894'),
('Fitriani', 'P', '1992-02-18', 'Jl. Ahmad Yani No 15', 'Menikah', '081234567895'),
('Hendro Siswanto', 'L', '1985-09-09', 'Jl. Imam Bonjol No 7', 'Menikah', '081234567896'),
('Rina Gunawan', 'P', '1978-11-20', 'Jl. S. Parman No 22', 'Menikah', '081234567897'),
('Dimas Anggara', 'L', '1998-04-30', 'Jl. MT Haryono No 9', 'Belum Menikah', '081234567898'),
('Nia Ramadhani', 'P', '1990-08-05', 'Jl. HR Rasuna Said No 4', 'Menikah', '081234567899');

INSERT INTO ruangan (nama_ruangan, fungsi, status_ruangan) VALUES
('Ruang Mawar 1', 'Rawat Inap', 'Tersedia'),
('Ruang Mawar 2', 'Rawat Inap', 'Tersedia'),
('Ruang Melati 1', 'Rawat Inap', 'Digunakan'),
('Ruang Anggrek', 'ICU', 'Tersedia'),
('Ruang Operasi 1', 'Operasi', 'Tersedia'),
('Ruang Operasi 2', 'Operasi', 'Pemeliharaan'),
('Ruang Konsultasi Umum 1', 'Rawat Jalan', 'Tersedia'),
('Ruang Konsultasi Gigi', 'Rawat Jalan', 'Tersedia'),
('Ruang IGD 1', 'Darurat', 'Tersedia'),
('Ruang IGD 2', 'Darurat', 'Tersedia');

-- Pegawai: 1 Admin, 10 Dokter, 10 Perawat
INSERT INTO pegawai (nama, alamat, telepon, jabatan, spesialisasi, username, password) VALUES
('Super Admin', 'Jl. Admin', '08000000', 'Admin', NULL, 'admin', 'admin123'),

('Dr. Andi', 'Jl. Dokter 1', '08111111', 'Dokter', 'Umum', 'dokter_andi', 'dokter123'),
('Dr. Budi', 'Jl. Dokter 2', '08111112', 'Dokter', 'Umum', 'dokter_budi', 'dokter123'),
('Dr. Caca', 'Jl. Dokter 3', '08111113', 'Dokter', 'Gigi', 'dokter_caca', 'dokter123'),
('Dr. Dedi', 'Jl. Dokter 4', '08111114', 'Dokter', 'Gigi', 'dokter_dedi', 'dokter123'),
('Dr. Eka', 'Jl. Dokter 5', '08111115', 'Dokter', 'Bedah', 'dokter_eka', 'dokter123'),
('Dr. Fery', 'Jl. Dokter 6', '08111116', 'Dokter', 'Bedah', 'dokter_fery', 'dokter123'),
('Dr. Gina', 'Jl. Dokter 7', '08111117', 'Dokter', 'Anak', 'dokter_gina', 'dokter123'),
('Dr. Hadi', 'Jl. Dokter 8', '08111118', 'Dokter', 'Anak', 'dokter_hadi', 'dokter123'),
('Dr. Iwan', 'Jl. Dokter 9', '08111119', 'Dokter', 'Umum', 'dokter_iwan', 'dokter123'),
('Dr. Joko', 'Jl. Dokter 10', '08111120', 'Dokter', 'Bedah', 'dokter_joko', 'dokter123'),

('Sr. Ani', 'Jl. Perawat 1', '08222221', 'Perawat', NULL, 'perawat_ani', 'perawat123'),
('Sr. Bena', 'Jl. Perawat 2', '08222222', 'Perawat', NULL, 'perawat_bena', 'perawat123'),
('Sr. Cici', 'Jl. Perawat 3', '08222223', 'Perawat', NULL, 'perawat_cici', 'perawat123'),
('Sr. Dina', 'Jl. Perawat 4', '08222224', 'Perawat', NULL, 'perawat_dina', 'perawat123'),
('Sr. Evi', 'Jl. Perawat 5', '08222225', 'Perawat', NULL, 'perawat_evi', 'perawat123'),
('Sr. Fina', 'Jl. Perawat 6', '08222226', 'Perawat', NULL, 'perawat_fina', 'perawat123'),
('Sr. Gita', 'Jl. Perawat 7', '08222227', 'Perawat', NULL, 'perawat_gita', 'perawat123'),
('Sr. Hana', 'Jl. Perawat 8', '08222228', 'Perawat', NULL, 'perawat_hana', 'perawat123'),
('Sr. Ira', 'Jl. Perawat 9', '08222229', 'Perawat', NULL, 'perawat_ira', 'perawat123'),
('Sr. Jeni', 'Jl. Perawat 10', '08222230', 'Perawat', NULL, 'perawat_jeni', 'perawat123');

INSERT INTO obat (nama_obat, satuan, stok, keterangan) VALUES
('Paracetamol 500mg', 'Tablet', 1000, 'Obat penurun panas dan pereda nyeri'),
('Amoxicillin 500mg', 'Kapsul', 500, 'Antibiotik'),
('Omeprazole 20mg', 'Kapsul', 300, 'Obat asam lambung'),
('Ibuprofen 400mg', 'Tablet', 600, 'Obat anti inflamasi non steroid'),
('Cetirizine 10mg', 'Tablet', 400, 'Obat alergi'),
('Salbutamol', 'Inhaler', 50, 'Obat asma'),
('Metformin 500mg', 'Tablet', 800, 'Obat diabetes'),
('Amlodipine 5mg', 'Tablet', 700, 'Obat penurun darah tinggi'),
('Vitamin C 500mg', 'Tablet', 1200, 'Suplemen vitamin'),
('Betadine', 'Botol', 100, 'Antiseptik luka');

-- Initial Appointments (some waiting, some scheduled, some finished)
INSERT INTO pendaftaran (id_pasien, kd_poli, tanggal_jadwal, jenis_perawatan, id_dokter, id_perawat, kd_ruangan, status, keterangan) VALUES
(1, 1, '2026-05-06 09:00:00', 'Rawat Jalan', 2, 12, 7, 'Dijadwalkan', 'Keluhan pusing dan demam'),
(2, 2, '2026-05-06 10:00:00', 'Rawat Jalan', 4, 13, 8, 'Dijadwalkan', 'Sakit gigi geraham'),
(3, 3, '2026-05-07 08:00:00', 'Operasi', 6, 14, 5, 'Dijadwalkan', 'Operasi usus buntu'),
(4, 4, '2026-05-06 11:00:00', 'Rawat Jalan', 8, 15, 7, 'Menunggu', 'Anak demam tinggi'),
(5, 1, '2026-05-08 09:00:00', 'Rawat Inap', 2, 16, 1, 'Dijadwalkan', 'Observasi tifus'),
(6, 1, '2026-05-01 08:30:00', 'Rawat Jalan', 2, 12, 7, 'Selesai', 'Pusing dan mual hebat');

-- Dummy Penyakit
INSERT INTO penyakit (nama_penyakit, keterangan) VALUES 
('Demam Berdarah Dengue', 'Infeksi virus dengue yang ditularkan oleh nyamuk Aedes aegypti'),
('Tifus (Demam Tifoid)', 'Infeksi bakteri Salmonella typhi akibat makanan/minuman terkontaminasi'),
('Gastroenteritis', 'Infeksi saluran pencernaan (Muntaber)'),
('Hipertensi', 'Kondisi tekanan darah tinggi kronis'),
('Pulpitis', 'Peradangan pada pulpa gigi');

-- Dummy Tindakan
INSERT INTO tindakan (nama_tindakan, harga) VALUES 
('Konsultasi Dokter Umum', 150000),
('Konsultasi Dokter Spesialis', 250000),
('Cabut Gigi', 300000),
('Operasi Usus Buntu', 15000000),
('Pemeriksaan Darah Lengkap', 200000),
('Pemasangan Infus', 100000);

-- Dummy Rekam Medis (untuk Pendaftaran #6 yang sudah 'Selesai')
INSERT INTO rekam_medis (kd_pendaftaran, tanggal, catatan) VALUES
(6, '2026-05-01 09:00:00', 'Pasien mengalami dehidrasi ringan akibat muntaber, diberikan obat pereda mual dan antibiotik.');

-- Relasi Rekam Medis dengan Penyakit
INSERT INTO rekam_medis_penyakit (kd_pemeriksaan, kd_penyakit) VALUES
(1, 3); -- Gastroenteritis

-- Relasi Rekam Medis dengan Tindakan
INSERT INTO rekam_medis_tindakan (kd_pemeriksaan, kd_tindakan) VALUES
(1, 1), -- Konsultasi Umum
(1, 6); -- Pasang Infus

-- Resep Obat
INSERT INTO resep (kd_pemeriksaan, tanggal) VALUES
(1, '2026-05-01 09:15:00');

-- Detail Resep
INSERT INTO detail_resep (kd_resep, kd_obat, jumlah) VALUES
(1, 1, 10), -- Paracetamol
(1, 3, 5);  -- Omeprazole

-- Pembayaran
INSERT INTO pembayaran (kd_pemeriksaan, total, keterangan) VALUES
(1, 250000, 'Lunas'); -- 150k Konsultasi + 100k Infus (Asumsi obat masuk tagihan terpisah atau sudah include)

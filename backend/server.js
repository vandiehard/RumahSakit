const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Assuming empty password for local dev
    database: 'rumah_sakit',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Auth Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM pegawai WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            const user = rows[0];
            res.json({
                success: true,
                user: {
                    id: user.id_pegawai,
                    nama: user.nama,
                    jabatan: user.jabatan,
                    spesialisasi: user.spesialisasi
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Public Routes (Landing Page)
app.get('/api/public/jadwal_pasien', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.nama as nama_pasien, 
                pd.tanggal_jadwal, 
                pd.jenis_perawatan, 
                r.nama_ruangan,
                po.nama_poli,
                pd.status
            FROM pendaftaran pd
            JOIN pasien p ON pd.id_pasien = p.id_pasien
            LEFT JOIN ruangan r ON pd.kd_ruangan = r.kd_ruangan
            LEFT JOIN poli po ON pd.kd_poli = po.kd_poli
            WHERE pd.status != 'Menunggu'
            ORDER BY pd.tanggal_jadwal ASC
            LIMIT 50
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin Routes
app.get('/api/admin/obat', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM obat');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/admin/obat', async (req, res) => {
    const { nama_obat, satuan, stok, keterangan } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO obat (nama_obat, satuan, stok, keterangan) VALUES (?, ?, ?, ?)', [nama_obat, satuan, stok, keterangan]);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/admin/obat/:id', async (req, res) => {
    const { stok } = req.body;
    try {
        await pool.query('UPDATE obat SET stok = ? WHERE kd_obat = ?', [stok, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/admin/ruangan', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ruangan');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/admin/ruangan/:id', async (req, res) => {
    const { status_ruangan } = req.body;
    try {
        await pool.query('UPDATE ruangan SET status_ruangan = ? WHERE kd_ruangan = ?', [status_ruangan, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/admin/pendaftaran', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                pd.*, p.nama as nama_pasien, po.nama_poli,
                dok.nama as nama_dokter, per.nama as nama_perawat,
                r.nama_ruangan
            FROM pendaftaran pd
            JOIN pasien p ON pd.id_pasien = p.id_pasien
            JOIN poli po ON pd.kd_poli = po.kd_poli
            LEFT JOIN pegawai dok ON pd.id_dokter = dok.id_pegawai
            LEFT JOIN pegawai per ON pd.id_perawat = per.id_pegawai
            LEFT JOIN ruangan r ON pd.kd_ruangan = r.kd_ruangan
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/admin/pendaftaran/:id/assign', async (req, res) => {
    const { id_dokter, id_perawat, kd_ruangan, status } = req.body;
    try {
        await pool.query(
            'UPDATE pendaftaran SET id_dokter = ?, id_perawat = ?, kd_ruangan = ?, status = ? WHERE kd_pendaftaran = ?',
            [id_dokter, id_perawat, kd_ruangan, status, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/admin/pegawai/:jabatan', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_pegawai, nama, spesialisasi FROM pegawai WHERE jabatan = ?', [req.params.jabatan]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Penyakit
app.get('/api/admin/penyakit', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM penyakit');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
app.post('/api/admin/penyakit', async (req, res) => {
    try {
        const { nama_penyakit, keterangan } = req.body;
        const [result] = await pool.query('INSERT INTO penyakit (nama_penyakit, keterangan) VALUES (?, ?)', [nama_penyakit, keterangan]);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Tindakan
app.get('/api/admin/tindakan', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tindakan');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
app.post('/api/admin/tindakan', async (req, res) => {
    try {
        const { nama_tindakan, harga } = req.body;
        const [result] = await pool.query('INSERT INTO tindakan (nama_tindakan, harga) VALUES (?, ?)', [nama_tindakan, harga]);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Pembayaran
app.get('/api/admin/pembayaran', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, rm.tanggal, pd.kd_pendaftaran, pas.nama as nama_pasien 
            FROM pembayaran p
            JOIN rekam_medis rm ON p.kd_pemeriksaan = rm.kd_pemeriksaan
            JOIN pendaftaran pd ON rm.kd_pendaftaran = pd.kd_pendaftaran
            JOIN pasien pas ON pd.id_pasien = pas.id_pasien
            ORDER BY rm.tanggal DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
app.put('/api/admin/pembayaran/:id', async (req, res) => {
    try {
        await pool.query('UPDATE pembayaran SET keterangan = ? WHERE kd_pembayaran = ?', [req.body.keterangan, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Doctor Routes
app.get('/api/dokter/jadwal/:id_dokter', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                pd.*, p.nama as nama_pasien, po.nama_poli,
                r.nama_ruangan
            FROM pendaftaran pd
            JOIN pasien p ON pd.id_pasien = p.id_pasien
            JOIN poli po ON pd.kd_poli = po.kd_poli
            LEFT JOIN ruangan r ON pd.kd_ruangan = r.kd_ruangan
            WHERE pd.id_dokter = ?
            ORDER BY pd.tanggal_jadwal ASC
        `, [req.params.id_dokter]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/dokter/resep', async (req, res) => {
    const { kd_pendaftaran, obat_list, catatan } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // 1. Create rekam medis
        const [rmResult] = await connection.query(
            'INSERT INTO rekam_medis (kd_pendaftaran, tanggal, catatan) VALUES (?, NOW(), ?)',
            [kd_pendaftaran, catatan || '']
        );
        const kd_pemeriksaan = rmResult.insertId;

        // 2. Create resep
        const [resepResult] = await connection.query(
            'INSERT INTO resep (kd_pemeriksaan, tanggal) VALUES (?, NOW())',
            [kd_pemeriksaan]
        );
        const kd_resep = resepResult.insertId;

        // 3. Insert detail_resep and update obat stock
        for (let item of obat_list) {
            if (item.kd_obat) {
                await connection.query(
                    'INSERT INTO detail_resep (kd_resep, kd_obat, jumlah) VALUES (?, ?, ?)',
                    [kd_resep, item.kd_obat, item.jumlah]
                );
                await connection.query(
                    'UPDATE obat SET stok = stok - ? WHERE kd_obat = ?',
                    [item.jumlah, item.kd_obat]
                );
            }
        }

        // Insert penyakit
        if (req.body.penyakit_list && req.body.penyakit_list.length > 0) {
            for (let p of req.body.penyakit_list) {
                await connection.query(
                    'INSERT INTO rekam_medis_penyakit (kd_pemeriksaan, kd_penyakit) VALUES (?, ?)',
                    [kd_pemeriksaan, p]
                );
            }
        }

        // Insert tindakan
        if (req.body.tindakan_list && req.body.tindakan_list.length > 0) {
            for (let t of req.body.tindakan_list) {
                await connection.query(
                    'INSERT INTO rekam_medis_tindakan (kd_pemeriksaan, kd_tindakan) VALUES (?, ?)',
                    [kd_pemeriksaan, t]
                );
            }
        }

        // 4. Create Pembayaran
        // Hitung total dari tindakan + obat (asumsi obat gratis / atau jika ada harga bisa ditambah)
        let totalBiaya = 0;
        if (req.body.tindakan_list && req.body.tindakan_list.length > 0) {
             const [tindakanRows] = await connection.query('SELECT SUM(harga) as total_tindakan FROM tindakan WHERE kd_tindakan IN (?)', [req.body.tindakan_list]);
             if (tindakanRows[0].total_tindakan) totalBiaya += parseFloat(tindakanRows[0].total_tindakan);
        }
        await connection.query('INSERT INTO pembayaran (kd_pemeriksaan, total, keterangan) VALUES (?, ?, ?)', [kd_pemeriksaan, totalBiaya, 'Belum Dibayar']);

        // 5. Update status pendaftaran
        await connection.query('UPDATE pendaftaran SET status = ? WHERE kd_pendaftaran = ?', ['Selesai', kd_pendaftaran]);

        await connection.commit();
        res.json({ success: true, kd_pemeriksaan });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        connection.release();
    }
});

// Nurse Routes
app.get('/api/perawat/jadwal/:id_perawat', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                pd.*, p.nama as nama_pasien, po.nama_poli,
                r.nama_ruangan, dok.nama as nama_dokter
            FROM pendaftaran pd
            JOIN pasien p ON pd.id_pasien = p.id_pasien
            JOIN poli po ON pd.kd_poli = po.kd_poli
            LEFT JOIN ruangan r ON pd.kd_ruangan = r.kd_ruangan
            LEFT JOIN pegawai dok ON pd.id_dokter = dok.id_pegawai
            WHERE pd.id_perawat = ?
            ORDER BY pd.tanggal_jadwal ASC
        `, [req.params.id_perawat]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});

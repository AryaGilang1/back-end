const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));

// Konfigurasi koneksi database MySQL
const db = mysql.createConnection({
  host: '34.101.100.181',
  user: 'root',
  password: '2505',
  database: 'db_mahasiswa'
});


const db1 = mysql.createConnection({
  host: '34.101.100.181',
  user: 'root',
  password: '2505',
  database: 'db_kampus'
});



// Membuka koneksi database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database', err);
    return;
  }
  console.log('Connected to database (db_mahasiswa)');
});

// Menggunakan koneksi database kedua (db1)
db1.connect((err) => {
  if (err) {
    console.error('Error connecting to database', err);
    return;
  }
  console.log('Connected to database (db_kampus)');
});

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000'); // Ubah domain sesuai dengan domain Anda
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// ...
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.get('/data_mahasiswa', (req, res) => {
  const query = 'SELECT * FROM data_mahasiswa';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching data_mahasiswa', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});


// Endpoint untuk mendapatkan semua data_mahasiswa
app.get('/data_mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM data_mahasiswa WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data_mahasiswa', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: 'data_mahasiswa not found' });
      return;
    }
    res.json(result[0]);
  });
});

// Endpoint untuk membuat data_mahasiswa baru
app.post('/data_mahasiswa', (req, res) => {
  const { nama, nim, jurusan } = req.body;
  const query = 'INSERT INTO data_mahasiswa (nama, nim, jurusan) VALUES (?, ?, ?)';
  db.query(query, [nama, nim, jurusan], (err, result) => {
    if (err) {
      console.error('Error creating data_mahasiswa', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const id = result.insertId;
    res.json({ id, nama, nim, jurusan });
  });
});

// Endpoint untuk mengubah data data_mahasiswa berdasarkan ID
app.put('/data_mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const { nama, nim, jurusan } = req.body;
  const query = 'UPDATE data_mahasiswa SET nama = ?, nim = ?, jurusan = ? WHERE id = ?';
  db.query(query, [nama, nim, jurusan, id], (err, result) => {
    if (err) {
      console.error('Error updating data_mahasiswa', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'data_mahasiswa updated successfully' });
  });
});

// Endpoint untuk menghapus data_mahasiswa berdasarkan ID
app.delete('/data_mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM data_mahasiswa WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data_mahasiswa', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'data_mahasiswa deleted successfully' });
  });
});

// ...

// Endpoint untuk mendapatkan semua dosen
app.get('/dosen', (req, res) => {
  const query = 'SELECT * FROM dosen';
  db1.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching dosen', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});

// Endpoint untuk mendapatkan dosen berdasarkan ID
app.get('/dosen/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM dosen WHERE id = ?';
  db1.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching dosen', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: 'Dosen not found' });
      return;
    }
    res.json(result[0]);
  });
});

// Endpoint untuk membuat dosen baru
app.post('/dosen', (req, res) => {
  const { nim, nama, jk, alamat } = req.body;
  const query = 'INSERT INTO dosen (nim, nama, jk, alamat) VALUES (?, ?, ?, ?)';
  db1.query(query, [nim, nama, jk, alamat], (err, result) => {
    if (err) {
      console.error('Error creating dosen', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const id = result.insertId;
    res.json({ id, nim, nama, jk, alamat });
  });
});

// Endpoint untuk mengubah data dosen berdasarkan ID
app.put('/dosen/:id', (req, res) => {
  const id = req.params.id;
  const { nim, nama, jk, alamat } = req.body;
  const query = 'UPDATE dosen SET nim = ?, nama = ?, jk = ?, alamat = ? WHERE id = ?';
  db1.query(query, [nim, nama, jk, alamat, id], (err, result) => {
    if (err) {
      console.error('Error updating dosen', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Dosen updated successfully' });
  });
});

// Endpoint untuk menghapus dosen berdasarkan ID
app.delete('/dosen/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM dosen WHERE id = ?';
  db1.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting dosen', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Dosen deleted successfully' });
  });
});


// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// if (process.env.NODE_ENV === 'development') {
//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: err.message });
//   });
// }

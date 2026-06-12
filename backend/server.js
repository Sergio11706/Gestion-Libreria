require('dotenv').config();
const express = require('express');
const pool = require('./config/database'); // importamos la conexión
const librosRouter = require('./routes/libros');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use('/api/libros', librosRouter);

app.get('/', (req, res) => {
  res.send('Backend de Gestión Librería funcionando');
});

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend en http://0.0.0.0:${PORT}`);
});

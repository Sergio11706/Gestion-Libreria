require('dotenv').config();
const express = require('express');
const { pool } = require('./config/database');
const UsuarioRoutes = require('./routes/UsuarioRoutes');
const LibroRoutes = require('./routes/LibroRoutes');
const EmpleadoRoutes = require('./routes/EmpleadoRoutes');
const IsbnRoutes = require('./routes/IsbnRoutes');
const { sequelize } = require('./config/sequelize');
const { seedEncargadoDemo } = require('./config/seed');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas');
    await seedEncargadoDemo();
  } catch (error) {
    console.error('Error sincronizando tablas:', error);
  }
})();

app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/libros', LibroRoutes);
app.use('/api/empleados', EmpleadoRoutes);
app.use('/api', IsbnRoutes);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend en http://0.0.0.0:${PORT}`);
});

require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');

// Pool MySQL2 (para conexiones directas si es necesario)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_libreria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Instancia Sequelize con reintentos de conexión
const sequelize = new Sequelize(process.env.DB_NAME || 'gestion_libreria', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
  retry: {
    max: 5, // Reintentos máximos
    timeout: 3000 // Esperar 3 segundos entre reintentos
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { pool, sequelize, DataTypes };

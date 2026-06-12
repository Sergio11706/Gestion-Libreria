const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// POST /api/libros — registrar nuevo libro
router.post('/', async (req, res) => {
  const {
    titulo,
    autor,
    isbn,
    editorial,
    categoria,
    precio_costo,
    precio_venta,
    stock,
    fecha_ingreso,
  } = req.body;

  if (!titulo || !autor || !isbn) {
    return res.status(400).json({ error: 'Título, autor e ISBN son obligatorios.' });
  }

  try {
    const tiene_stock_bajo = stock !== undefined && stock < 5 ? 1 : 0;

    const [result] = await pool.execute(
      `INSERT INTO libros 
        (titulo, autor, isbn, editorial, categoria, precio_costo, precio_venta, fecha_ingreso, tiene_stock_bajo, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        autor,
        isbn,
        editorial || null,
        categoria || null,
        precio_costo || null,
        precio_venta || null,
        fecha_ingreso || new Date().toISOString().split('T')[0],
        tiene_stock_bajo, 
        stock || 0,
      ]
    );

    res.status(201).json({ message: 'Libro registrado exitosamente.', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un libro con ese ISBN.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// GET /api/libros — listar todos los libros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM libros ORDER BY fecha_ingreso DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
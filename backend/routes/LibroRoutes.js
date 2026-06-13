const express = require('express');
const router = express.Router();
const {
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  obtenerLibros,
  obtenerLibroPorId
} = require('../controllers/LibroController');

router.post('/', crearLibro);
router.get('/', obtenerLibros);
router.get('/:id', obtenerLibroPorId);
router.put('/:id', actualizarLibro);
router.delete('/:id', eliminarLibro);

module.exports = router;

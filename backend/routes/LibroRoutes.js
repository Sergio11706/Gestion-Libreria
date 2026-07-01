const express = require('express');
const LibroController = require('../controllers/LibroController');

const router = express.Router();

router.get('/libros', LibroController.listar);
router.get('/libros/:id', LibroController.obtenerPorId);
router.post('/libros', LibroController.crear);
router.put('/libros/:id', LibroController.actualizar);
router.delete('/libros/:id', LibroController.eliminar);
router.get('/validar-isbn', LibroController.validarIsbn);

module.exports = router;

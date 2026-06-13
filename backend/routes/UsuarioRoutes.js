const express = require('express');
const router = express.Router();
const {
  validarUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId
} = require('../controllers/UsuarioController');

router.post('/validar', validarUsuario);
router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;

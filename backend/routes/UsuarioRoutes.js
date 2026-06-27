const express = require('express');
const router = express.Router();
const {
  validarUsuario,
  validarEmpleado,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId
} = require('../controllers/UsuarioController');

router.post('/validar', validarUsuario);
router.post('/validar-empleado', validarEmpleado);
router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;

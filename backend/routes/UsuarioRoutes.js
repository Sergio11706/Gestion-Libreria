const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();

router.post('/usuarios', UsuarioController.crear);
router.post('/usuarios/validar', UsuarioController.validar);
router.get('/empleados', UsuarioController.listarEmpleados);
router.post('/empleados', UsuarioController.crearEmpleado);
router.put('/empleados/:id', UsuarioController.actualizarEmpleado);
router.delete('/empleados/:id', UsuarioController.eliminarEmpleado);

module.exports = router;

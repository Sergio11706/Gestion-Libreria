const express = require('express');
const router = express.Router();
const {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
} = require('../controllers/EmpleadoController');

router.post('/', crearEmpleado);
router.get('/', obtenerEmpleados);
router.get('/:id', obtenerEmpleadoPorId);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

module.exports = router;

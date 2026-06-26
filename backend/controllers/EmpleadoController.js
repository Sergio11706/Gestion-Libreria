const { sequelize, Usuario, Empleado } = require('../config/sequelize');

const camposRequeridos = (body) => {
  const { nombre_usuario, contraseña, nombre, apellido, email, telefono } = body;
  return nombre_usuario && contraseña && nombre && apellido && email && telefono;
};

const formatearEmpleado = (empleado) => ({
  id_usuario: empleado.id_usuario,
  nombre_usuario: empleado.usuario?.nombre_usuario,
  nombre: empleado.nombre,
  apellido: empleado.apellido,
  email: empleado.email,
  telefono: empleado.telefono
});

const crearEmpleado = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    if (!camposRequeridos(req.body)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const { nombre_usuario, contraseña, nombre, apellido, email, telefono } = req.body;

    const usuarioExistente = await Usuario.findOne({
      where: { nombre_usuario },
      transaction
    });

    if (usuarioExistente) {
      await transaction.rollback();
      return res.status(409).json({ error: 'El nombre de usuario ya existe' });
    }

    const usuario = await Usuario.create({ nombre_usuario, contraseña }, { transaction });

    const empleado = await Empleado.create({
      id_usuario: usuario.id_usuario,
      nombre,
      apellido,
      email,
      telefono
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      telefono: empleado.telefono
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'nombre_usuario']
      }],
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });

    return res.json(empleados.map(formatearEmpleado));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'nombre_usuario']
      }]
    });

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    return res.json(formatearEmpleado(empleado));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const actualizarEmpleado = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { nombre_usuario, contraseña, nombre, apellido, email, telefono } = req.body;

    const empleado = await Empleado.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario' }],
      transaction
    });

    if (!empleado) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    if (nombre_usuario && nombre_usuario !== empleado.usuario.nombre_usuario) {
      const duplicado = await Usuario.findOne({
        where: { nombre_usuario },
        transaction
      });

      if (duplicado) {
        await transaction.rollback();
        return res.status(409).json({ error: 'El nombre de usuario ya existe' });
      }
    }

    await empleado.usuario.update({
      ...(nombre_usuario ? { nombre_usuario } : {}),
      ...(contraseña ? { contraseña } : {})
    }, { transaction });

    await empleado.update({
      ...(nombre ? { nombre } : {}),
      ...(apellido ? { apellido } : {}),
      ...(email ? { email } : {}),
      ...(telefono ? { telefono } : {})
    }, { transaction });

    await transaction.commit();

    const actualizado = await Empleado.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'nombre_usuario']
      }]
    });

    return res.json(formatearEmpleado(actualizado));
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

const eliminarEmpleado = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id, { transaction });

    if (!empleado) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    await empleado.destroy({ transaction });
    await Usuario.destroy({ where: { id_usuario: id }, transaction });

    await transaction.commit();
    return res.json({ message: 'Empleado eliminado' });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
};

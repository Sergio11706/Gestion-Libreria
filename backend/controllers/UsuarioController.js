const { Usuario, Encargado, Empleado } = require('../config/sequelize');

const validarUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: 'nombre_usuario y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({
      where: { nombre_usuario, contraseña },
      include: [{
        model: Encargado,
        as: 'encargado',
        required: true
      }]
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    return res.json({
      rol: 'encargado',
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      encargado: usuario.encargado
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const validarEmpleado = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: 'nombre_usuario y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({
      where: { nombre_usuario, contraseña },
      include: [{
        model: Empleado,
        as: 'empleado',
        required: true
      }]
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    return res.json({
      rol: 'empleado',
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      empleado: {
        id_usuario: usuario.empleado.id_usuario,
        nombre: usuario.empleado.nombre,
        apellido: usuario.empleado.apellido,
        email: usuario.empleado.email,
        telefono: usuario.empleado.telefono
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: 'nombre_usuario y contraseña son requeridos' });
    }

    const nuevoUsuario = await Usuario.create({ nombre_usuario, contraseña });
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, contraseña } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.update({ nombre_usuario, contraseña });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    return res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  validarUsuario,
  validarEmpleado,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId
};

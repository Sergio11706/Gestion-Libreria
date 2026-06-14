const Usuario = require('../models/Usuario');

const validarUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: 'nombre_usuario y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({
      where: { nombre_usuario, contraseña }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    return res.json(usuario);
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
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId
};

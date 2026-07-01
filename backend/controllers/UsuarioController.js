const Usuario = require('../models/Usuario');
const Empleado = require('../models/Empleado');
const Encargado = require('../models/Encargado');

const serializarEmpleado = (empleado, usuario) => ({
  id_usuario: empleado.id_usuario,
  nombre_usuario: usuario?.nombre_usuario || null,
  contraseña: usuario?.contraseña || null,
  nombre: empleado.nombre,
  apellido: empleado.apellido,
  email: empleado.email,
  telefono: empleado.telefono
});

const construirRespuestaUsuario = async (usuario) => {
  if (!usuario) return null;

  const empleado = await Empleado.findByPk(usuario.id_usuario, { raw: true });
  const encargado = await Encargado.findByPk(usuario.id_usuario, { raw: true });

  if (encargado) {
    return {
      rol: 'encargado',
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      encargado: {
        ...encargado,
        nombre_usuario: usuario.nombre_usuario
      }
    };
  }

  if (empleado) {
    return {
      rol: 'empleado',
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      empleado: {
        ...empleado,
        nombre_usuario: usuario.nombre_usuario
      }
    };
  }

  return {
    rol: 'empleado',
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario
  };
};

exports.validar = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({
      where: { nombre_usuario, contraseña }
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const respuesta = await construirRespuestaUsuario(usuario);
    return res.json(respuesta);
  } catch (error) {
    console.error('Error al validar usuario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { nombre_usuario } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El nombre de usuario ya existe' });
    }

    const usuario = await Usuario.create({ nombre_usuario, contraseña });
    return res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.listarEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({ order: [['id_usuario', 'ASC']], raw: true });
    const usuarios = await Usuario.findAll({ raw: true });

    const resultado = empleados.map((empleado) => {
      const usuario = usuarios.find((item) => item.id_usuario === empleado.id_usuario);
      return serializarEmpleado(empleado, usuario);
    });

    return res.json(resultado);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.crearEmpleado = async (req, res) => {
  try {
    const { nombre_usuario, contraseña, nombre, apellido, email, telefono } = req.body;

    if (!nombre_usuario || !contraseña || !nombre || !apellido || !email || !telefono) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { nombre_usuario } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El nombre de usuario ya existe' });
    }

    const usuario = await Usuario.create({ nombre_usuario, contraseña });
    const empleado = await Empleado.create({
      id_usuario: usuario.id_usuario,
      nombre,
      apellido,
      email,
      telefono
    });

    return res.status(201).json(serializarEmpleado(empleado.toJSON(), usuario));
  } catch (error) {
    console.error('Error al crear empleado:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (req.body.nombre_usuario || req.body.contraseña) {
      await usuario?.update({
        nombre_usuario: req.body.nombre_usuario ?? usuario.nombre_usuario,
        contraseña: req.body.contraseña ?? usuario.contraseña
      });
    }

    await empleado.update({
      nombre: req.body.nombre ?? empleado.nombre,
      apellido: req.body.apellido ?? empleado.apellido,
      email: req.body.email ?? empleado.email,
      telefono: req.body.telefono ?? empleado.telefono
    });

    return res.json(serializarEmpleado(empleado.toJSON(), usuario));
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    await empleado.destroy();
    if (usuario) {
      await usuario.destroy();
    }

    return res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

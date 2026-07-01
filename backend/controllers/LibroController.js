const Libro = require('../models/Libro');

exports.listar = async (req, res) => {
  try {
    const libros = await Libro.findAll({ order: [['id_libro', 'ASC']] });
    return res.json(libros);
  } catch (error) {
    console.error('Error al listar libros:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    return res.json(libro);
  } catch (error) {
    console.error('Error al obtener libro:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.crear = async (req, res) => {
  try {
    const libro = await Libro.create(req.body);
    return res.status(201).json(libro);
  } catch (error) {
    console.error('Error al crear libro:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    await libro.update(req.body);
    return res.json(libro);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    await libro.destroy();
    return res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.validarIsbn = async (req, res) => {
  try {
    const isbn = String(req.query.isbn || '').trim();

    if (!isbn) {
      return res.status(400).json({ valido: false, error: 'ISBN requerido' });
    }

    const libroExistente = await Libro.findOne({ where: { isbn } });
    const valido = isbn.length >= 10;

    return res.json({
      valido,
      existe: Boolean(libroExistente),
      error: valido ? undefined : 'ISBN inválido'
    });
  } catch (error) {
    console.error('Error al validar ISBN:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

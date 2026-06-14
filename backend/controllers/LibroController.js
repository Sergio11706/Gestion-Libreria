const Libro = require('../models/Libro');

const crearLibro = async (req, res) => {
  try {
    const {
      titulo,
      autor,
      isbn,
      editorial,
      categoria,
      precio_costo,
      precio_venta,
      fecha_ingreso,
      tiene_stock_bajo,
      stock
    } = req.body;

    const nuevoLibro = await Libro.create({
      titulo,
      autor,
      isbn,
      editorial,
      categoria,
      precio_costo,
      precio_venta,
      fecha_ingreso,
      tiene_stock_bajo,
      stock
    });

    return res.status(201).json(nuevoLibro);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    await libro.update(req.body);
    return res.json(libro);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    await libro.destroy();
    return res.json({ message: 'Libro eliminado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll();
    return res.json(libros);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    return res.json(libro);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  obtenerLibros,
  obtenerLibroPorId
};

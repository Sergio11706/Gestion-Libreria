'use strict';

const { validarFormato, buscarEnGoogleBooks } = require('../services/IsbnService');

async function validarIsbn(req, res) {
  const { isbn } = req.query;

  if (!isbn) {
    return res.status(400).json({ valido: false, error: 'ISBN requerido' });
  }

  // 1. Validación matemática de formato
  const parsed = validarFormato(isbn);

  if (!parsed) {
    return res.status(200).json({ valido: false, error: 'El formato del ISBN no es válido.' });
  }

  // 2. Búsqueda de metadatos en Google Books (best effort, nunca invalida el ISBN)
  const isbnLimpio = parsed.isbn13 || parsed.isbn10;
  const { existe, info } = await buscarEnGoogleBooks(isbnLimpio);

  return res.status(200).json({
    valido: true,
    existe,
    tipo: parsed.isIsbn13 ? 'ISBN-13' : 'ISBN-10',
    isbn10: parsed.isbn10,
    isbn13: parsed.isbn13,
    titulo: info?.title ?? null,
    autor: info?.authors?.[0] ?? null,
    editorial: info?.publisher ?? parsed.publisher ?? null,
    portada: info?.imageLinks?.thumbnail ?? null,
  });
}

module.exports = { validarIsbn };
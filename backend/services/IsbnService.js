'use strict';

const ISBN = require('isbn3');

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const FETCH_TIMEOUT_MS = 5000;

/**
 * Valida el formato matemático de un ISBN (10 o 13 dígitos, dígito de control correcto).
 * Esta es la ÚNICA validación que puede marcar el ISBN como inválido.
 * @param {string} isbn
 * @returns {object|null} datos parseados del ISBN, o null si el formato no es válido
 */
function validarFormato(isbn) {
  return ISBN.parse(isbn); // isbn3 devuelve null si el formato no es válido
}

/**
 * Busca metadatos del libro en Google Books a partir del ISBN.
 * Es "best effort": si no aparece (editorial chica, libro de tirada local, etc.)
 * o si la API de Google falla/tarda, devuelve existe=null sin lanzar error.
 * La NO existencia en Google Books NUNCA debe bloquear el registro de un libro.
 * @param {string} isbnLimpio
 * @returns {Promise<{existe: boolean|null, info: object|null}>}
 */
async function buscarEnGoogleBooks(isbnLimpio) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = `${GOOGLE_BOOKS_API}?q=isbn:${isbnLimpio}`;
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      return { existe: null, info: null };
    }

    const data = await response.json();
    const encontrado = data.totalItems > 0;
    const info = encontrado ? data.items[0].volumeInfo : null;

    return { existe: encontrado, info };
  } catch (error) {
    // Timeout, sin conexión, API caída, etc. -> no bloqueamos el flujo de registro
    return { existe: null, info: null };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { validarFormato, buscarEnGoogleBooks };
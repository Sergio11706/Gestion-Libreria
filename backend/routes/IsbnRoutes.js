'use strict';

const express = require('express');
const router = express.Router();
const { validarIsbn } = require('../controllers/IsbnController');

router.get('/validar-isbn', validarIsbn);

module.exports = router;
const express = require('express');
const router = express.Router();

// Rotas do sistema
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/contacts', require('./contacts'));
router.use('/clients', require('./clients'));
router.use('/employees', require('./employees'));
router.use('/posts', require('./posts'));
router.use('/products', require('./products'));
router.use('/projects', require('./projects'));
router.use('/quotes', require('./quotes'));
router.use('/services', require('./services'));

module.exports = router;

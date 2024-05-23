const express = require('express');
const router = express.Router();

const pokemonRoutes = require('./pokemon');
const timeRoutes = require('./times');

router.use('/pokemon', pokemonRoutes);
router.use('/times', timeRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * App Routes
 */

router.get('/', gameController.homepage);


module.exports = router;
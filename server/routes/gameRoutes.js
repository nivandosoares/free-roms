const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * App Routes
 */

router.get('/', gameController.homepage);
router.get('/game/:id', gameController.exploreGame);
router.get('/categories', gameController.exploreCategories);
router.get('/categories/:id', gameController.exploreCategoriesById);
router.post('/search', gameController.searchGame);
router.get('/explore-latest', gameController.exploreLatest);

module.exports = router;
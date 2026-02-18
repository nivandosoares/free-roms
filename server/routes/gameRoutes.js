const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

/**
 * App Routes
 */

router.get("/", gameController.homepage);
router.get("/about", gameController.aboutPage);
router.get("/contact", gameController.contactPage);
router.get("/faq", gameController.faqPage);
router.get("/game/:id", gameController.exploreGame);
router.get("/categories", gameController.exploreCategories);
router.get("/categories/:id", gameController.exploreCategoriesById);
router.post("/search", gameController.searchGame);
router.get("/explore-latest", gameController.exploreLatest);
router.get("/explore-random", gameController.exploreRandom);
router.get("/submit-game", gameController.submitGame);
router.post("/submit-game", gameController.submitGameOnPost);

module.exports = router;

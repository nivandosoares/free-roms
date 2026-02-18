const path = require("path");

require("../models/database");
const Category = require("../models/Category");
const Game = require("../models/Game");

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Game.find({}).sort({ _id: -1 }).limit(limitNumber);

    const Games = { latest };

    res.render("index", { title: "Node games - home", categories, Games });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occurred" });
  }
};

exports.aboutPage = async (req, res) => {
  res.render("about", { title: "Free Roms - About" });
};

exports.contactPage = async (req, res) => {
  res.render("contact", { title: "Free Roms - Contact" });
};

exports.faqPage = async (req, res) => {
  res.render("faq", { title: "Free Roms - FAQ" });
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Node games - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occurred" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const limitNumber = 20;
    const categoryById = await Game.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Node games - Categories",
      categoryById,
      selectedCategory: categoryId,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occurred" });
  }
};

exports.exploreGame = async (req, res) => {
  try {
    const gameId = req.params.id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).send({ message: "Game not found" });
    }

    res.render("game", { title: "Node games - Game", game });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occurred" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    const count = await Game.countDocuments();
    if (count === 0) {
      return res.render("explore-random", {
        title: "Free Roms - Random",
        game: null,
      });
    }

    const random = Math.floor(Math.random() * count);
    const game = await Game.findOne().skip(random).exec();
    res.render("explore-random", { title: "Free Roms - Random", game });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};

exports.submitGame = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-game", {
    title: "Free Roms - Submit Game",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitGameOnPost = async (req, res) => {
  try {
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
      req.flash("infoErrors", "Image file is required.");
      return res.redirect("/submit-game");
    }

    const imageUploadFile = req.files.image;
    newImageName = `${Date.now()}-${imageUploadFile.name}`;

    const uploadPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      newImageName
    );

    await imageUploadFile.mv(uploadPath);

    const newGame = new Game({
      name: req.body.name,
      description: req.body.description,
      shared_by: req.body.shared_by || "Anonymous",
      category: req.body.category,
      image: newImageName,
    });

    await newGame.save();

    req.flash("infoSubmit", "Game has been added.");
    res.redirect("/submit-game");
  } catch (error) {
    req.flash("infoErrors", error.message || "Could not save game.");
    res.redirect("/submit-game");
  }
};

exports.searchGame = async (req, res) => {
  try {
    const searchTerm = (req.body.searchTerm || "").trim();
    if (!searchTerm) {
      return res.render("search", { title: "Free Roms - Search", game: [] });
    }

    const game = await Game.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Free Roms - Search", game });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occurred" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const Games = await Game.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", { title: "Node games - Game", Games });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occurred" });
  }
};

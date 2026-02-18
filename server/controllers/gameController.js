const path = require("path");
const https = require("https");

require("../models/database");
const Category = require("../models/Category");
const Game = require("../models/Game");

const COVER_PLACEHOLDER = "placeholder-cover.svg";

const sanitizeFileName = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "free-roms-app/1.0",
          Accept: "application/json",
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`Request failed with status ${res.statusCode}`));
          return;
        }

        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(rawData));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(4000, () => req.destroy(new Error("Request timeout")));
  });

const resolveCoverFromGameName = async (gameName) => {
  try {
    const normalizedName = encodeURIComponent((gameName || "").trim());
    if (!normalizedName) {
      return COVER_PLACEHOLDER;
    }

    const data = await fetchJson(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${normalizedName}`
    );

    if (data && data.thumbnail && data.thumbnail.source) {
      return data.thumbnail.source;
    }

    return COVER_PLACEHOLDER;
  } catch (error) {
    return COVER_PLACEHOLDER;
  }
};

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

exports.downloadGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).send({ message: "Game not found" });
    }

    if (!game.romFile) {
      return res.status(404).send({ message: "ROM file not available" });
    }

    const romPath = path.join(process.cwd(), "public", "roms", game.romFile);

    res.download(romPath, game.romFile, async (error) => {
      if (error) {
        if (!res.headersSent) {
          res.status(500).send({ message: "Could not start download" });
        }
        return;
      }

      try {
        await Game.findByIdAndUpdate(game._id, { $inc: { downloadCount: 1 } });
      } catch (updateError) {
        console.error(updateError);
      }
    });
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
    let imageName = COVER_PLACEHOLDER;

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.romFile) {
      req.flash("infoErrors", "ROM file is required.");
      return res.redirect("/submit-game");
    }

    const gameName = (req.body.name || "").trim();
    const nameSlug = sanitizeFileName(gameName || "game-rom");

    const romUploadFile = req.files.romFile;
    const romFileName = `${Date.now()}-${nameSlug}-${sanitizeFileName(
      romUploadFile.name
    )}`;
    const romPath = path.join(process.cwd(), "public", "roms", romFileName);

    await romUploadFile.mv(romPath);

    if (req.files.image) {
      const imageUploadFile = req.files.image;
      imageName = `${Date.now()}-${sanitizeFileName(imageUploadFile.name)}`;
      const imagePath = path.join(process.cwd(), "public", "uploads", imageName);
      await imageUploadFile.mv(imagePath);
    } else {
      imageName = await resolveCoverFromGameName(gameName);
    }

    const newGame = new Game({
      name: gameName,
      description: req.body.description,
      shared_by: req.body.shared_by || "Anonymous",
      category: req.body.category,
      image: imageName,
      romFile: romFileName,
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

require('../models/database');
const Category = require('../models/Category');
const Game = require('../models/Game');

/**
 * GET /
 * Homepage
 */

exports.homepage = async(req, res) => {
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Game.find({}).sort({_id: -1}).limit(limitNumber); 
    
        const Games = {latest}
        
        res.render('index', { title: 'Node games - home', categories, Games });    
        
    } catch (error) {
        res.status(500).send({message: error.message || "error ocurred"});
    }

}




exports.exploreCategories = async(req, res) => {
    try {

        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Node games - Categories', categories });    
        
    } catch (error) {
        res.status(500).send({message: error.message || "error ocurred"});
    }

}


exports.exploreCategoriesById = async(req, res) => {
    try {

        let categoryId = req.params.id;

        const limitNumber = 20;
        const categoryById = await Game.find({'category': categoryId}).limit(limitNumber);
        res.render('categories', { title: 'Node games - Categories', categoryById });    
        
    } catch (error) {
        res.status(500).send({message: error.message || "error ocurred"});
    }

}


exports.exploreGame = async(req, res) => {
    try {

        let gameId = req.params.id;

        const game = await Game.findById(gameId);
        res.render('game', { title: 'Node games - Game', game });    
        
    } catch (error) {
        res.status(500).send({message: error.message || "error ocurred"});
    }

}


exports.searchGame = async (req, res) => {
    try {
    
        let searchTerm = req.body.searchTerm;

        let game = await Game.find({$text: {$search: searchTerm, $diacriticSensitive: true}})
        res.render('search', { title: 'Free Roms - Search', game });
    } catch (error) {
        
}



}


exports.exploreLatest = async(req, res) => {
    try {
        const limitNumber = 20;
        const Games = await Game.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Node games - Game', Games });    
        
    } catch (error) {
        res.status(500).send({message: error.message || "error ocurred"});
    }

}



/*

async function insertDummyGameData() {
    
    try {
        await Game.insertMany([
    {
        "name": "Metal Gear",
        "description": "The game's premise revolves around a special forces operative codenamed Solid Snake who carries out a one-man sneaking mission into the hostile nation of Outer Heaven to destroy Metal Gear, a bipedal walking tank capable of launching nuclear missiles from anywhere in the world. Most of the subsequent games in the series follow this same premise, often changing the characters, locations, and weapons.",
        "shared_by": "Anonymous",
        "category": "MSX",
        "image": "metal-gear.jpg"
    },
    {
        "name": "doom",
        "description": "Doom is a 1993 first-person shooter (FPS) game developed by id Software for MS-DOS. Players assume the role of a space marine, popularly known as Doomguy, fighting their way through hordes of invading demons from Hell. The first episode, comprising nine levels, was distributed freely as shareware and played by an estimated 15-20 million people within two years; the full game, with two further episodes, was sold via mail order. An updated version with an additional episode and more difficult levels, The Ultimate Doom, was released in 1995 and sold at retail.",
        "shared_by": "Anonymous",
        "category": "Microsoft DOS",
        "image": "doom.jpg"
    },
    {
        "name": "Gran Turismo",
        "description": "Gran Turismo,[a][b] originally released as Gran Turismo: The Real Driving Simulator in Japan and Europe, is a 1997 racing simulation video game developed by Polys Entertainment and published by Sony Computer Entertainment for the PlayStation video game console. Designed by Kazunori Yamauchi, the game's development group was later established as Polyphony Digital. It is the first title in the Gran Turismo series",
        "shared_by": "Anonymous",
        "category": "PlayStation",
        "image": "gran-turismo.jpg"
    },
    {
        "name": "Sonic the hedgehog",
        "description": "Sonic the Hedgehog[a] is a Japanese video game series and media franchise created and owned by Sega. The franchise follows Sonic, an anthropomorphic blue hedgehog who battles the evil Doctor Eggman, a mad scientist. The main Sonic the Hedgehog games are platformers mostly developed by Sonic Team; other games, developed by various studios, include spin-offs in the racing, fighting, party and sports genres. The franchise also incorporates printed media, animations, feature films, and merchandise.",
        "shared_by": "Anonymous",
        "category":"Mega Drive",
        "image": "sonic.jpg"
    },
    {
        "name": "GTA Vice City Stories",
        "description": "Grand Theft Auto: Vice City Stories is an action-adventure game developed in a collaboration between Rockstar Leeds and Rockstar North, and published by Rockstar Games. The tenth instalment in the Grand Theft Auto series, the game was initially released as a PlayStation Portable exclusive in October 2006. A PlayStation 2 port was released in March 2007. Set within the fictional Vice City (based on Miami) in 1984, the game is a prequel to 2002's Grand Theft Auto: Vice City (set in 1986) and follows the exploits of ex-soldier Victor Vic Vance, a minor character originally featured in said game. The story centres around Vics attempts to build up a criminal empire alongside his brother Lance, coming into conflict with rival gangs, drug lords and other enemies.",
        "shared_by": "Anonymous",
        "category": "PSP",
        "image": "gta-vcs.jpg"
    },
    {
        "name": "Metal Gear 2: Solid Snake",
        "description": "",
        "shared_by": "Anonymous",
        "category": "MSX-2",
        "image": "metal-gear2.jpg"
    },
]); 
    } catch (error) {
        console.log(error);
    }
}
insertDummyGameData();
*/
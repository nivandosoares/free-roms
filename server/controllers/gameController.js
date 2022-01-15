require('../models/database');
const Category = require('../models/Category');

/**
 * GET /
 * Homepage
 */

exports.homepage = async(req, res) => {

    
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('index', { title: 'Node games - home', categories });    
        
    } catch (error) {
        res.status(500).send({message: error.message || "error ocurred"});
    }




}







/*
async function insertDummyCategoryData() {
    
    try {
        await Category.insertMany([
    {
        "name": "Metal Gear",
        "image": "metal-gear.jpg"
    },
    {
        "name": "doom",
        "image": "doom.jpg"
    },
    {
        "name": "Gran Turismo",
        "image": "gran-turismo.jpg"
    },
    {
        "name": "Sonic the hedgehog",
        "image": "sonic.jpg"
    },
    {
        "name": "GTA Vice City Stories",
        "image": "gta-vcs.jpg"
    },
    {
        "name": "Metal Gear 2: Solid Snake",
        "image": "metal-gear2.jpg"
    },
]); 
    } catch (error) {
        console.log(error);
    }
}
insertDummyCategoryData();
*/
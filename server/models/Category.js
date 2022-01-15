const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required : "this field is required"
    },
    image: {
        type: String,
        required : "this field is required"
    }
});

module.exports = mongoose.model('category', CategorySchema);
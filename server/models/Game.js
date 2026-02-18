const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required : "this field is required"
    },
    description: {
        type: String,
        required : "this field is required"
    },
    shared_by: {
        type: String,
        required : "this field is required"
    },
    category: {
        type: String,
        enum:["MSX", "PSP", "MSX-2", "Microsoft DOS", "Mega Drive", "PlayStation"],
        required : "this field is required"
    },
    image: {
        type: String,
        required : "this field is required"
    }
    
});

GameSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Game', GameSchema);

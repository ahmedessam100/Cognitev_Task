const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    country: String,
    budget: String,
    goal: String,
    category: String
});

module.exports = mongoose.model('Model', Schema);

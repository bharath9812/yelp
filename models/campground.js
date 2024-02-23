const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

const Campground = mongoose.model('CampGround', CampgroundSchema);

module.exports = Campground; 
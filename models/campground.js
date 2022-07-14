const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
   title: String,
   image: String,
   price: Number,
   description: String,
   location: String 
});

module.exports = mongoose.model('Campground', CampgroundSchema) // bare in mind that by making a model, mongodb creates a lowercase and plural name database of the first parameter in 'mongoose.model()'




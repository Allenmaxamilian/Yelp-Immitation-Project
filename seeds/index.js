const mongoose = require('mongoose');  
const cities = require('./cities');   
const { descriptors, places } = require('./seedHelpers')                          // requiring Mongoose => which is an Object Data Modeling (ODM) library for MongoDB.  
const Campground = require('../models/campground');                              // requiring a path to where the campground.js file is located, in this case it's located in the directory 'models'. The additional Campground', CampgroundSchema) // bare in mind that by making a model, mongodb creates a lowercase and plural name database of the first parameter in '.' each mean a level up in the directories



mongoose.connect('mongodb://localhost:27017/yelp-camp');                        // Connecting to mongodb and creating a db: 'yelp-camp'

const db = mongoose.connection;                                                // storing mongoose.connection in variable 'db' for shorter code.
                                               
db.on("error", console.error.bind(console, "connection error:"));              // error handling code
db.once("open", () => {
    console.log("Database connected")
});

const sample = (array) => {                                                    // using the array length to multiple with Math.random to return a whole number
   return array[Math.floor(Math.random() * array.length)];
}


const seedDB = async() => {                                                                    // An anonyomous async functinon will be immediately called. It is useful since you don't need to re-type the function name to execute the function
    await Campground.deleteMany({});                                                          // Will await for a promise, that will be returned by Campground.deleteMany({}).
    for (let i = 0; i < 50; i++){                                                            // Async function's purpose is to continue to execue other code while, it waits for previous code that has not been executed, to execute. 
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp =  new Campground({                                                      // The 'new' keyword creates an object, while the following 'Campground' dictates how that object will be populated, in this case it will be populated according to our campground schema we created in campground.js
            location: `${cities[random1000].city}, ${cities[random1000].state}`,           // each specific key property in the new Campground object will be populated with the cities index number of 'random1000' and selects the city key property in the object within the 'cities' array, which is in cities.js 
            title: `${sample(descriptors)} ${sample(places)}`,                             // executing the function 'sample' we created above and passing in 'descriptors' and 'places' exported from 'seedHelpers.js' file. Each 'title' key property in the new Campground object, will be populated with random names from the 'seedHelpers.js' file.
            image: 'https://source.unsplash.com/collection/483251/1600x900',
            description:  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius tempore praesentium rerum iusto voluptatum fuga quidem, vel consequatur corporis impedit earum. Aliquam, quo rerum maxime facilis ea placeat consectetur modi?',
            price                       
        });
        await camp.save();
    }                                                         
}

seedDB().then(() => {
    mongoose.connection.close();
})
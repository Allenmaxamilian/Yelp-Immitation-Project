//  Note, remember to refresh either the browser page to see changes or use the terminal to make sure you are connected to the database...

const express = require('express');                                              // requiring Express framework
const path = require('path')                                                    // requiring a path => which is a module that provides useful functionality to access and interact with the file system:  Ex:  'path.basename(), path.dirname(), path.isAbsolute()'
const mongoose = require('mongoose');                                           // requiring Mongoose => which is an Object Data Modeling (ODM) library for MongoDB.  
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')                               // Because html forms really only send a get or post request, we can use 'method-override' to allow for other requests. Requires NPM installation       
const Campground = require('./models/campground');                              // requiring a path to where the campground.js file is located, in this case it's located in the directory 'models'
const app = express();                                                          // creates a new express application for you to use



                                                                                // Middleware are functions that run during the request/response lifecycle. Middleware has access to the request and response objects.

mongoose.connect('mongodb://localhost:27017/yelp-camp');                        // Connecting to mongodb and creating a db: 'yelp-camp'

const db = mongoose.connection;                                                // storing mongoose.connection in variable 'db' for shorter code.
db.on("error", console.error.bind(console, "connection error:"));              // error handling code
db.once("open", () => {
    console.log("Database connected")
});




app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')                                                  // using express to set a view engine => which typically are a combination of HTML and another programming language, in our case we are setting it to be EJS
app.set('views', path.join(__dirname, 'views'))                               // combining the absolute path of the currently executing file ('app.js') with the 'views' directory

app.use(express.urlencoded({ extended: true }))                               // This piece of code will parse the request.body. You must 'tell' Express to parse req.body via this code piece. Middleware.
app.use(methodOverride('_method'));                                           // after requiring 'method-override' you must 'use' it. Within the parenthesis, you input the desired query string that will be attached to the form's action via the '?'

app.get('/', (req, res) => {                                                  // this express code is creating a route handler to '/' which when matched by the input in th url by the client, will render the home.ejs file
    res.render('home')                                                        // both parameters (req, res) are objects. The req object represents an HTTP request an has properties for the request query string, parameters, body and HTTP headers 
})                                                                            // the res object represents the HTTP response that an Express app sends when it gets an HTTP request      

app.get('/campgrounds', async (req, res) => {                                  // creating a route handler for '/campground'. The async function creates a promise for later code to be used. T
    const campgrounds = await Campground.find({});                            // The later code to be used is 'Campground.find({})', which is given the promise to return/resolve via the await 'keyword'. When it does resolve, then it will be stored in our variable campgrounds.
    res.render('campgrounds/index', { campgrounds })                           //                              
})

app.get('/campgrounds/new', (req, res) => {                                   // Order of executionable code matters. If /campgrounds/new was after /campgrounds/:id,
    res.render('campgrounds/new');                                           // the get request handler of /campgrounds/:id would treat /campgrounds/new as an id and as a result, would not find it
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
})

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})


app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })   // Using spread operator to spread the object into the req.body.campground 'object'
    res.redirect(`/campgrounds/${campground._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;                                                 // req.params is an object that contains properties 'mapped' to the named route handler 'parameters'. Ex. If I have the route, '/campgrounds/:id', then the 'id' property is available as 'req.params.id'                    
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}) 


app.listen(4000, () => {                                                      // This code 'listens' on a 'channel' on the local host, to conduct code
    console.log('Serving on port 4000')
});
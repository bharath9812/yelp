// npm i express mongoose ejs method-override ejs-mate // npm packages used (install these first)


const express = require('express');
const ejsMate = require('ejs-mate');

const app = express();
// requiring path to set absolute path for the /views
const path = require('path');

const mongoose = require('mongoose');
const methodOverride = require('method-override');

//getting the model
const CampGround = require('./models/campground')





main()

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp')
        .then(() => {
            console.log('MONGO connection is open') 
        })
        .catch(err => {
            console.log('MONGO connection error', err);
    })
} 


// ====================================================================================================

//                      MIDDLEWARE  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// to parse the payload of req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')) // method for our query string
app.engine('ejs',ejsMate,);

// ===============================================================================================================


app.get('/', (req, res) => {
    res.render('home')
})

// index route
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', {campgrounds});
})


// route to create new campgrounds

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// new campground form end point to post req

app.post('/campgrounds', async (req, res) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body.campground);

} )


// show route
app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/show', {campground})
})

// route to edit the campground 
app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit.ejs', {campground})
})

// put request to submit the edit form

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    // res.send('updated');
    res.redirect(`/campgrounds/${campground._id}`)
})

// route to delete the campground

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');

})

app.listen(3000, () => {
    console.log('Working on port 3K');
})



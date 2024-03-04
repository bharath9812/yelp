// npm i express mongoose ejs method-override ejs-mate joi

//requiring packages needed
const express = require('express');
const ejsMate = require('ejs-mate');
const app = express();
// requiring path to set absolute path for the /views
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js')

//getting the model
const CampGround = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

// ====================================================================================================
// connecting mongoose

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

// data validation middleware

const validateCampground = (req, res, next) => {
    
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
    // console.log(result);
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// =================================================================================================================

//      RESTFUL ROUTES

app.get('/', (req, res) => {
    res.render('home')
})

// index route
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', {campgrounds});
}))


// route to create new campgrounds

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// new campground form end point to post req

app.post('/campgrounds', validateCampground, catchAsync(async (req, res,next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body.campground);

}) )


// show route
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));
// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
//     const id = req.params.id;
//     const campground = await CampGround.findById(id);
//     res.render('campgrounds/show', {campground})
// }))

// route to edit the campground 
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit.ejs', {campground})
}))

// put request to submit the edit form

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    // res.send('updated');
    res.redirect(`/campgrounds/${campground._id}`)
}))

// route to delete the campground

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // pull used like a index to get from an array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
    // res.send('deleted man bye')
}))


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
    // res.send("Not found");
});



app.listen(3000, () => {
    console.log('Working on port 3K');
})
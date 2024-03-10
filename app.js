// npm i express mongoose ejs method-override ejs-mate joi connect-flash path express-session passport passport

//requiring packages needed
const express = require('express');
const ejsMate = require('ejs-mate');
const app = express();
// requiring path to set absolute path for the /views
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const passport = require('passport');
const LocalStrategy = require('passport-local');

//getting the model
const User = require('./models/user');
const CampGround = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

const campgrounds = require(('./routes/campground.js'))
const reviews = require(('./routes/reviews.js'))

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


// for serving static assets
app.use(express.static(path.join(__dirname, 'public')))

// to parse the payload of req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')) // method for our query string
app.engine('ejs',ejsMate,);

// ===============================================================================================================

// data validation middleware

// const validateCampground = (req, res, next) => {
    
//     const {error} = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     }
//     else {
//         next();
//     }
//     // console.log(result);
// }

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


// =================================================================================================================

// express sessions for authentication

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    //including resave and saveUninitialized to handle the deprecations
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //  the cookie cant be accessed by client side scripts
        // (XSS) for safekeeping the cookie from revealing to third party
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,// for a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));



// connect-flash ======================================================

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // store
passport.deserializeUser(User.deserializeUser()); // unstore


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



// routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


app.get('/', (req, res) => {
    res.render('home')
})




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
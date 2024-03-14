if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
// require('dotenv').config();


// npm i express mongoose ejs method-override ejs-mate joi connect-flash path express-session passport passport dotenv multer cloudinary multer-storage-cloudinary @mapbox/mapbox-sdk express-mongo-sanitize connect-mongo@3.2.0

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo')(session);

//getting the models
const User = require('./models/user');
const CampGround = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const { MongoStore } = require('connect-mongo');

const campgroundRoutes = require(('./routes/campground.js'))
const reviewRoutes = require(('./routes/reviews.js'))
const userRoutes = require(('./routes/users.js'))

// ====================================================================================================
// connecting mongoose
const dbUrlCloud = process.env.DB_URL
const dbUrl = 'mongodb://127.0.0.1:27017/yelp'

main()

async function main() {
    await mongoose.connect(dbUrlCloud)
        .then(() => {
            console.log('MONGO connection is open') 
        })
        .catch(err => {
            console.log('MONGO connection error', err);
    })
} 



// mongoose
//     .connect(dbUrl, { 
//         useNewUrlParser: true,
//         useCreateIndex: true
//       })
//     .then(() => console.log('MongoDB connected...'))
//     .catch(err => console.log(err));



// ====================================================================================================

//                      MIDDLEWARE  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// for serving static assets
app.use(express.static(path.join(__dirname, 'public')))

// to parse the payload of req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')) // method for our query string
app.engine('ejs', ejsMate,);
app.use(mongoSanitize({
    replaceWith: '_'
}))


// =================================================================================================================

// express sessions for authentication

const store = new MongoDBStore({
    url: dbUrl,
    // secret: 'thisshouldbeabettersecret!',
    secret: process.env.DB_URL,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log('session store error', e);
})

const sessionConfig = {
    store: store,
    name: 'userC',
    secret: process.env.DB_URL,
    // secret: 'thisshouldbeabettersecret!',
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
app.use(flash());
// app.use(helmet({contentSecurityPolicy: false}));
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dgbzkix4o/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // store
passport.deserializeUser(User.deserializeUser()); // unstore


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



// routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
    // res.send("Not found");
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
    console.log('Working on port 3K');
})
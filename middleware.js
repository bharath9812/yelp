const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const CampGround = require('./models/campground');
const Review = require('./models/review');


// data validation middleware

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {        
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
    // console.log(result);
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do changes!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// validation middle ware

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}



// use the storeReturnTo middleware to save the returnTo value from session to res.locals
// to return the back to the place where last stayed before authentication
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        // console.log("returnTo value:", req.session.returnTo);
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

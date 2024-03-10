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

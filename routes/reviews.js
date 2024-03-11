const express = require('express');

//by default express router like to keep params separate
//(id can't be accessed from ' / campgrounds /: id / reviews'), so we merge the params
const router = express.Router({ mergeParams: true});
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const reviews = require('../controllers/reviews');

const { reviewSchema } = require('../schemas.js')
const Review = require('../models/review');
const CampGround = require('../models/campground');


// old route '/campgrounds/:id/reviews'
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// findByIdAndDelete on triggers the findOneAndDelete middleware defined in campground.js
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
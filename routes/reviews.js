const express = require('express');

//by default express router like to keep params separate
//(id can't be accessed from ' / campgrounds /: id / reviews'), so we merge the params
const router = express.Router({ mergeParams: true});
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Review = require('../models/review');
const CampGround = require('../models/campground');

const { reviewSchema } = require('../schemas.js')



// old route '/campgrounds/:id/reviews'
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// findByIdAndDelete on triggers the findOneAndDelete middleware defined in campground.js
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // pull used like a index to get from an array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
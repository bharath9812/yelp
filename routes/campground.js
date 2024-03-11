const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const { campgroundSchema} = require('../schemas.js')

const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');






    //      RESTFUL ROUTES


// index route
router.get('/', catchAsync(campgrounds.index));


// route to create new campgrounds
router.get('/new', isLoggedIn, campgrounds.newForm)


// new campground form end point to post req
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));


// show route
router.get('/:id', catchAsync(campgrounds.showCampground));


// route to edit the campground 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))


// put request to submit the edit form
router.put('/:id', isAuthor, isLoggedIn, isAuthor, validateCampground,
    catchAsync(campgrounds.updateCamp));


// route to delete the campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))

module.exports = router;
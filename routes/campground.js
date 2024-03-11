const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary/index');
// const upload = multer({ dest: 'uploads/'  }) // for local storage
const upload = multer({ storage })

const ExpressError = require('../utils/ExpressError');
const { campgroundSchema} = require('../schemas.js')

const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');







    //      RESTFUL ROUTES


// index route and 
// new campground form end point to post req
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync(campgrounds.createCampground));
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send('worked');
    // })



// route to create new campgrounds
router.get('/new', isLoggedIn, campgrounds.newForm)


// show route
// put request to submit the edit form
// route to delete the campground

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isAuthor, isLoggedIn, isAuthor, validateCampground,
        catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))



// route to edit the campground 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))



module.exports = router;
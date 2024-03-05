const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const { campgroundSchema} = require('../schemas.js')

const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync');



// data validation middleware

const validateCampground = (req, res, next) => {
    
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



//      RESTFUL ROUTES



// index route
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', {campgrounds});
}))


// route to create new campgrounds

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

// new campground form end point to post req

router.post('/', validateCampground, catchAsync(async (req, res,next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a CampGround');
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body.campground);

}) )


// show route
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));
// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
//     const id = req.params.id;
//     const campground = await CampGround.findById(id);
//     res.render('campgrounds/show', {campground})
// }))

// route to edit the campground 
router.get('/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit.ejs', {campground})
}))

// put request to submit the edit form

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    // res.send('updated');
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

// route to delete the campground

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');

}))

module.exports = router;
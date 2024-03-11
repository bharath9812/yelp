const CampGround = require('../models/campground');

//index route
module.exports.index = async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.newForm = (req, res) => {
    
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res,next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const campground = new CampGround(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id; 
    await campground.save();
    req.flash('success', 'Successfully created a CampGround');
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body.campground);

}

module.exports.showCampground = async (req, res,) => {
    const campground = await CampGround.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
    }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.editForm = async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', {campground})
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');

}
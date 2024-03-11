const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.get('/register', users.renderReg);

//returnTo behaviour
const { storeReturnTo } = require('../middleware');


router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin)


router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    users.login);


router.get('/logout', users.logout); 


module.exports = router;

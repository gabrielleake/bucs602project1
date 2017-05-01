var express = require('express');
var router = express.Router();
var csurf = require('csurf');
// user mgmt / auth / login etc
var passport = require('passport');

var csurfProtection = csurf();
// router . use targets all requests

// apply the protection to the router to protect routes
// all the routes included in "router" should be protected by csrf prot
router.use(csurfProtection);

// Check if user is logged in before allowing access to this page - must be in front of the isNotLoggedIn route check below
router.get('/profile', isLoggedIn, function(req, res, next){
    res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.use('/', isNotLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function(req, res, next){
    // get any flash msgs stored in request (they originate from passport)
    var messages = req.flash('error');
    console.log(messages);

    // Pass to view
    res.render('user/signup', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', function(req, res, next){
    // get any flash msgs stored in request (they originate from passport)
    var messages = req.flash('error');
    console.log(messages);

    console.log('displaying sign in page...');
    // Pass to view
    res.render('user/signin', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    // configuration javascript object
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;

// Function to protect routes to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // user can continue
        return next();
    }
    else
    {
        res.redirect('/');
    }
}

// Function to protect routes to ensure user is logged in
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        // user can continue
        return next();
    }
    else
    {
        res.redirect('/');
    }
}
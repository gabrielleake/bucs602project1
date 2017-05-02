var express = require('express');
var router = express.Router();
var csurf = require('csurf');
// user mgmt / auth / login etc
var passport = require('passport');

var Cart = require('../models/cart');
var Order = require('../models/order');

var csurfProtection = csurf();
// router . use targets all requests

// apply the protection to the router to protect routes
// all the routes included in "router" should be protected by csrf prot
router.use(csurfProtection);

// Check if user is logged in before allowing access to this page - must be in front of the isNotLoggedIn route check below
router.get('/profile', isLoggedIn, function(req, res, next){
    // Find orders for logged in user
    // Compare the user to the logged in user.  Mongoose will resolve them under the covers.
    Order.find({user: req.user}, function(err, orders){
        if (err)
        {
            console.log('error getting user orders!');
            return res.write('Error getting user orders!');
        }
        var cart;
        orders.forEach(function(order) {
            // Get the cart for each order in order to get the items in an array for display
            cart = new Cart(order.cart);
            order.items = cart.toItemArray();
        });
        res.render('user/profile', { orders: orders });
    });
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
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next){
        // If successful in logging in, reiirect to the last URL requested, if it exists
        if (req.session.lastUrlRequested){
            var lastUrlRequested = req.session.lastUrlRequested;
            req.session.lastUrlRequested = null; // clear so we don't break redirects
            res.redirect(lastUrlRequested);
        }
        else
        {
            // User logging in from normal path
            res.redirect('/');
        }
    }
);

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
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next){
        // If successful in logging in, reiirect to the last URL requested, if it exists
        if (req.session.lastUrlRequested){
            var lastUrlRequested = req.session.lastUrlRequested;
            req.session.lastUrlRequested = null; // clear so we don't break redirects
            res.redirect(lastUrlRequested);
        }
        else
        {
            // User logging in from normal path
            res.redirect('/');
        }
    }
);

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
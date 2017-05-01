var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

// When the user is stored in the session, it will be serialized by ID.
passport.serializeUser(function(user, done){
    done(null, user.id);

});

// Passport can now deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        // first arg always err case
        done(err, user);
    });
});

// Create new users using strategy
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // send request to callback function
    // callback function
}, function (req, email, password, done) {
    // express validations for email, password (must be 5 chars or more)
    console.log('in local.signup strategy def...');
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password, must be at least 5 characters long').notEmpty().isLength({min:5});

    // Retrieve errors from req using validationErrors().
    var errors = req.validationErrors();
    // Loop each error and add the err msg to array of messages for display on browser
    if (errors){
        var messages = [];

        errors.forEach(function(error){
            messages.push(error.msg);

        });
        // Return null since no real error, false for not success, then validation errs
        // Send validation msgs to view using flash
        return done(null, false, req.flash('error', messages));
    }
    // Strategy - check to see if user email already exists in the database
    User.findOne({
        'email': email}, function (err, user) {
       if (err){
           // return the error
           console.log('error: ');
           console.log(err);
           return done(err);
       }
       if (user) {
           // A user has been found because one already exists
           console.log('user already exists for this email');
           return done(null, false, {message: 'Email already in use.'});
       }
       console.log('creating new user...');
       var newUser = new User();
       newUser.email = email;
       newUser.password = newUser.encryptPassword(password);
       newUser.save(function(err, result) {
          if (err) {
              return done(err);
          }
          return done(null, newUser);
       });
    });
}));

// Local signin strategy - expects username/password
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    console.log('in local.signin strategy def...');
    // express validations for email, password (must be 5 chars or more)
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    console.log('made it past the initial checks');
    // Retrieve errors from req using validationErrors().
    var errors = req.validationErrors();
    console.log('got validation errors var');
    // Loop each error and add the err msg to array of messages for display on browser
    if (errors){
        console.log('errors exist...');
        var messages = [];

        errors.forEach(function(error){
            messages.push(error.msg);

        });
        // Return null since no real error, false for not success, then validation errs
        // Send validation msgs to view using flash
        return done(null, false, req.flash('error', messages));
    }
    console.log('calling Users.findOne for...');
    console.log(email);
    User.findOne({
        'email': email}, function (err, user) {
        console.log('got user...');
        console.log(user);
        console.log('error...');
        console.log(err);

        if (err){
            // return the error
            console.log('error: ');
            console.log(err);
            return done(err);
        }
        if (!user) {
            // A user has been found because one already exists
            console.log('user does not exist');
            return done(null, false, {message: 'No such user.'});
        }
        if (!user.validPassword(password))
        {
            console.log('Incorrect password');
            return done(null, false, {message: 'Wrong password.'});
        }

        return done(null, user);
    });
}));
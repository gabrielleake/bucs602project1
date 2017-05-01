var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// setup handlebars view engine
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
var session = require('express-session');
// user mgmt / auth / login etc
var passport = require('passport');
var $ = require('jquery');
// validation msgs
var connectFlash = require('connect-flash');

// validator
var validator = require('express-validator');

// Mongo session store
const MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

mongoose.connect('localhost:27017/shopping');
// Load the passport file (run code in passport.js to setup strategy config)
require('./config/passport');

// view engine setup
app.engine('.hbs', handlebars({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
// logging
app.use(logger('dev'));
// body-parser: Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// validator needs to run after body parser - parses the body and retrieves parameters we want to validate from
// submitted request body.
app.use(validator());

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());
// resave-prevent session from getting saved to server for each request
// saveUnit - session won't be stored on server if hasn't been initialized
// initialize session
app.use(session({
    secret: require('crypto').randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // use existing Mongoose connection
    cookie: { maxAge: 1000 * 60 * 120 } // 120 minute session timeout
}));

// initialize flash messages for validations
app.use(connectFlash());
app.use(passport.initialize());
// Use the session to store users
app.use(passport.session());
// Express built in middleware func to serve static files
//  refers to the dir where the script is stored/executed
app.use(express.static(path.join(__dirname, 'public')));

// Before sending a request to any route, add a middleware to execute on all requests
// Execute a function to set a global variable for the views to use
app.use(function(req,res,next){
  // Global variable using passport's authenticate function checks
    // Exposing authentication status to views
  res.locals.isAuthenticated = req.isAuthenticated();
  // Expose session to views/templates globally
    res.locals.userSession = req.session;
    console.log('jquery...');
    console.log($);
    console.log('res.locals.isAuthenticated');
    console.log(res.locals.isAuthenticated);
    console.log('res.locals.userSession');
    console.log(res.locals.userSession);

  next();
});

// user requests beginning w/ /user get redirected to user routes
app.use('/user', userRoutes);
// all others that begin with /, go to the index js file. This has to go after all sub routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

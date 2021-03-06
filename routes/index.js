var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Order = require('../models/order');
var Product = require('../models/product');
var controller = require('../controllers/shopController');

/* GET home page. */
router.get('/', function(req, res, next) {

    var successMessage = req.flash('success')[0];

   var products = Product.find(function(err,docs)
   {
       // Create an array of arrays such that each outer array is an array of 3 products.
       // Each product outer array will be a row for display
       var productGroups = [];
       var groupSize = 3;
       for (var i = 0; i < docs.length; i += groupSize)
       {
         productGroups.push(docs.slice(i, i + groupSize));
       }
       res.render('shop/index', { title: 'Shopping Cart', products: productGroups, successMsg: successMessage, noMessages: !successMessage });
   });
});

router.get('/addToCart/:id', function(req,res,next){
   // Store item added to cart into a cart object, which should be within the session
    var productIdentifier = req.params.id;

    // Create new cart.  Pass in existing cart if exists ins ession, otherwise empty array passed in
    var shoppingCart = new Cart(req.session.shoppingCart ? req.session.shoppingCart : {});

    // Get product from db
    Product.findById(productIdentifier, function(err, product){
       if (err){
           return res.redirect('/');
       }
       // Add item to cart
        shoppingCart.add(product, productIdentifier);

       //Store in cart session object
        req.session.shoppingCart = shoppingCart;
        console.log('printing shopping cart...');
        console.log(req.session.shoppingCart);
        console.log('printing shopping cart done...');
        res.redirect('/');
    });
});

router.get('/shoppingCart', function(req,res,next){
    if (!req.session.shoppingCart) {
        return res.render('shop/shoppingCart', {products: null});
    }

    // We have a cart
    var cart = new Cart(req.session.shoppingCart);
    res.render('shop/shoppingCart', {products: cart.toItemArray(), totalPrice: cart.total});

});

// Search the Products in the db on title and description
router.get('/search', function(req,res,next){
    var searchString = req.query.searchQuery;
    Product.find({
        $or:[
            {'title': new RegExp(searchString, "i")},
            {'description':new RegExp(searchString, "i")}
        ]
    },
        // callback function
        function(err,docs){
        console.log("docs found...");
        console.log(docs);
        var resultMessage = "No Products Found";
        if(docs.length > 0){
            resultMessage = docs.length + " product(s) found";
        }
        // Display results in groups of 3 to be consistent with current display
        productGroups = controller.groupProducts(docs, 3);
        res.render('shop/index', { title: 'Shopping Cart', products: productGroups,
            successMsg: resultMessage, noMessage: false, queryString: searchString });
        })
});

router.get('/checkout', isLoggedIn, function(req, res, next){

    if (!req.session.shoppingCart) {
        return res.redirect('/shoppingCart');
    }

    // Create a new cart instance
    var cart = new Cart(req.session.shoppingCart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.total, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req,res,next){
    if (!req.session.shoppingCart){
        return res.redirect('/shoppingCart');
    }
    var cart = new Cart(req.session.shoppingCart);

    // secret key
    var stripe = require("stripe")(
        "sk_test_wFt4mQVB3RBiU7DhLtfCI2gm"
    );

    stripe.charges.create({
        amount: cart.total * 100, // price is passed in cents
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js - token created by stripe js sdk which validated the cc
        description: "Test" + req.body.name
    }, function(err, charge) {
        if (err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var all_items_ids = [];
        for (var item_id in cart.items) {
            if (cart.items.hasOwnProperty(item_id)) {
                all_items_ids.push(item_id);
            }
        }
        Product.find({_id:{$in : all_items_ids}}, function(err, docs){
            if(err){
                console.log('Item stock update failed');
                req.flash('error', err.message);
                console.log(err);
                return res.redirect('/checkout');
            }

            // check if the items are in stock first
            for(var i=0; i<docs.length; i++){
                var doc = docs[i];
                if(doc.stockQty < cart.items[doc.id].qty){
                    req.flash('error', 'Sorry! '+doc.title+' does not have sufficient stock.');
                    return res.redirect('/checkout');
                }
            }

            var numberOfSaves=0;
            for(var i=0; i<docs.length; i++){
                var doc = docs[i];
                doc.stockQty = doc.stockQty - cart.items[doc.id].qty;
                doc.save(function(err){
                    if(err){
                        console.log('Item stock update failed');
                        req.flash('error', err.message);
                        console.log(err);
                        return res.redirect('/checkout');
                    }
                    numberOfSaves++;
                    if(numberOfSaves==docs.length){
                        saveOrder();
                    }
                });
            }
        });

        var saveOrder = function(){
            // Save a new order to the db
            var order = new Order({
                cart: cart,
                user: req.user, // Passport stores user in request when a user signs in
                address: req.body.address, // express stores values sent w/ POST request to req.body
                name: req.body.name,
                paymentId: charge.id // stripe docs - charge contains "id" field for each charge made
            });
            console.log(order);
            order.save(function(err, results){
                console.log('order save attempt...');
                if (err){
                    console.log('order save failed');
                    console.log(err);
                    return res.redirect('/checkout');
                }
                // We store a single message on the flash storage for success
                req.flash('success', 'Purchase complete!');
                // clear session shopping cart since the purchase has been completed
                req.session.shoppingCart = null;
                // send the user back to the home page
                res.redirect('/');
            });
        }
    });
});

module.exports = router;

// Function to protect routes to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // user can continue
        return next();
    }
    else
    {
        req.session.lastUrlRequested = req.url;
        res.redirect('/user/signin');
    }
}
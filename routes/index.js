var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
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
       res.render('shop/index', { title: 'Shopping Cart', products: productGroups });
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
module.exports = router;

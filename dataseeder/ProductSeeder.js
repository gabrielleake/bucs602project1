var Product = require('../models/product');

// Connect to mongoose from the seeding file
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
    // Need to pass new object with data to store in db
    imagePath: 'http://images.finishline.com/is/image/FinishLine/849560_002_P1?$Main$',
    title: 'Womens Nike Air Max 2017 Running Shoes',
        brand: 'Nike',
        sex: 'w',
    description: 'Dressed for ventilation and comfort with a full FlyMesh upper, these sneakers help to keep air flowing as you hit the gym or the streets. 360-degrees of Nike Air deliver a plush feel underfoot, while the Cushlon midsole offers a resilient spring to your step. Sleeker and more sophisticated than ever before, the Nike Air Max franchise has never looked so good.',
    price: 190
}),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/831508_002?$Main$',
        title: 'Mens New Balance 501 Casual Running Shoes',
        brand: 'New Balance',
        sex: 'm',
        description: 'A style closely related to the popular New Balance 574. The 501 features a suede and nylon upper with ENCAP cushioning technology in the midsole and a carbon rubber outsole for maximum durability. This classic sneaker looks great any time of year.',
        price: 69
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/831508_002?$Main$',
        title: 'Mens Nike Free RN Running Shoes',
        brand: 'Nike',
        sex: 'm',
        description: 'The next generation of the coveted Nike Free is here. Now with a newly designed auxetic tri-star outsole pattern, the Mens Nike Free RN Running Shoe offers the most flexible ride youve ever experienced from a Free model.',
        price: 79
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/830369_011_P1?$Main$',
        title: 'Mens Nike Flex 2016 RN Running Shoes',
        brand: 'Nike',
        sex: 'm',
        description: 'Bring out the best of your run and your style with the Mens Nike Flex Run 2016 Running Shoes. Designed to give you the smooth ride Nike is known for, these minimal-inspired running shoes are also perfect for everyday wear.',
        price: 49
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/848132_100?$Main$',
        title: 'Mens Nike Air Presto Running Shoes',
        brand: 'Nike',
        sex: 'm',
        description: 'Since its release in 2000, the Nike Air Presto has changed the game, offering apparel-style sizing teamed with a stretchy upper for a stellar fit. Evolved from the original design to embrace natural motion construction, the latest Mens Nike Air Presto Running Shoe boasts a lightweight feel thats perfect for everyday wear.',
        price: 99
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/819686_004_P1?$Main$',
        title: 'Mens Nike Sock Dart Running Shoes',
        brand: 'Nike',
        sex: 'm',
        description: 'A shoe thats been 20 years in the making, the Mens Nike Sock Dart Running Shoes. In 1984, Nike set out on a mission to create a shoe that was essentially a "sock with a sole." The shoe that was created would be known as the Nike Sock Racer. Now 20 years later, it has been reimagined with modern technologies that we know and love. The result of this modern update is the Nike Sock Dart. The Sock Dart features a super breathable mesh upper that utilizes an adjustable midfoot strap for a personalized fitting. Your feet will love the ultra-cushioned comfort that the full-length Phylon foam provides. Durability isnt an issue thanks to the rubber outsole and BRS 1000 in the heel. The Sock Dart takes a minimalistic approach to ultra-comfortable style, you wont regret slipping these bad boys on.',
        price: 109
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/849558_002?$Main$',
        title: 'Mens Nike Air VaporMax Flyknit Running Shoes',
        brand: 'Nike',
        sex: 'm',
        description: 'A shoe thats been 20 years in the making, the Mens Nike Sock Dart Running Shoes. In 1984, Nike set out on a mission to create a shoe that was essentially a "sock with a sole." The shoe that was created would be known as the Nike Sock Racer. Now 20 years later, it has been reimagined with modern technologies that we know and love. The result of this modern update is the Nike Sock Dart. The Sock Dart features a super breathable mesh upper that utilizes an adjustable midfoot strap for a personalized fitting. Your feet will love the ultra-cushioned comfort that the full-length Phylon foam provides. Durability isnt an issue thanks to the rubber outsole and BRS 1000 in the heel. The Sock Dart takes a minimalistic approach to ultra-comfortable style, you wont regret slipping these bad boys on.',
        price: 120
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/S76851_BGW?$Main$',
        title: 'Mens adidas NMD Runner XR1 Casual Shoes',
        brand: 'Adidas',
        sex: 'm',
        description: 'A fusion of the best adidas technologies and progressive street style collide for the Mens adidas NMD Runner XR1 Casual Shoes. A sock-like construction gives the XR1 a sleeker look than the normal NMD, while the breathable stretch-mesh upper provides an eye-catching aesthetic. Molded EVA midsole plugs give these beauties the signature NMD aesthetic. The energy-returning Boost midsole you know and love will each one of your steps charged with an endless supply of fast energy. If you are looking for the perfect kicks to stand up to your wardrobe look no further than the adidas NMD XR1 Casual Shoes.',
        price: 140
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/BB4489_GRY_P1?$Main$',
        title: 'Mens adidas UltraBOOST Uncaged Running Shoes',
        brand: 'Adidas',
        sex: 'm',
        description: 'Boost your next run in the stylish and innovative adidas Mens UltraBOOST Uncaged Running Sneakers. Featuring an engineered Primeknit upper that’s designed to naturally expand with your foot as you move for a sock-like feel. The SockFit construction offers a snug and supportive fit, that will you have primed to take on your day without irritation. Stability isn’t an issue thanks to the Molded TPU which offers stability and support around the heel of the shoe. The Continental Rubber outsole provides extraordinary grip against wet and dry conditions and its equipped with the same full Boost sole that you know and love.',
        price: 180
    }),
    new Product({
        // Need to pass new object with data to store in db
        imagePath: 'http://images.finishline.com/is/image/FinishLine/BB2885_RBW_P1?$Main$',
        title: 'Mens adidas NMD Runner Casual Shoes',
        brand: 'Adidas',
        sex: 'm',
        description: 'Does it get any better than a running shoe that can also be worn as a casual sneaker? That is exactly what you get with the Mens adidas NMD Runner Casual Shoes. The two-tone circular knit upper gives you a lightweight, breathable feel, while the full-length Boost midsole with EVA plugs gives your feet comfort unlike anything else. The leather heel tab gives you a premium feel on a running silhouette. With Boost cushioning taking over the sneaker scene you will definitely want to add these to your rotation!',
        price: 130
    })
];

var numberOfSaves = 0;
for (var i = 0; i < products.length; i++)
{
    // Mongoose will create new products collection and will insert the document
    products[i].save(function(err, result)
    {
        numberOfSaves++;
        if (numberOfSaves === products.length)
        {
            exit();
        }

    });
}
function exit() {

// Save is async so need to disconnect once all the shoes are inserted
    mongoose.disconnect();
}
var exports = {} ;

/**
 * return an array containing an array of products where each inner array is of size groupSize
 * @param products
 * @param groupSize
 * @returns {Array}
 */
exports.groupProducts = function(products, groupSize){
    var productGroups = [];
    for (var i = 0; i < products.length; i += groupSize)
    {
        productGroups.push(products.slice(i, i + groupSize));
    }
    return productGroups ;
} ;

module.exports = exports ;
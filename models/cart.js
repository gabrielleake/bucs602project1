/**
 * Cart Constructor
 * Retrieve the existing cart.  Will be empty initially.  Assign the values of existing cart to the new cart.
 * Function to add item to the cart checks to see if item group exists already.
 * @param currentCart
 */
module.exports = function Cart(currentCart) {
    // Store items as the previous cart's items
        this.items = currentCart.items || {};
        // items in cart
        this.cartQty = currentCart.cartQty || 0;
        // total cost of all items in cart
        this.total = currentCart.total || 0;

    // "items" is a collection of objects which have id's, but need to put each item into an array
    // for display capabilities
    this.toItemArray = function() {
        var array = [];
        for (var id in this.items){
            array.push(this.items[id]);
        }
        return array;
    }

    /*
     * Add a new product group if the item hasn't been added to the cart before
     * Amend a product group if the item already exists in the cart (i.e. inc. qty)
     */
    this.add = function(item, id) {
        // If the item we are adding is already in the cart, don't add it again. Update the qty.
        var cartItemGroup = this.items[id];
        if (!cartItemGroup) {
            // Initialize a new entry in the cart where the key is the product id
            // Also set this to the cartItemGroup as it has been added to the cart so we have a new
            // group for it
            cartItemGroup = this.items[id] = {item: item, qty: 0, price: 0};
        }
        cartItemGroup.qty++;
        cartItemGroup.price = cartItemGroup.item.price * cartItemGroup.qty;
        // Update the total cart qty
        this.cartQty++;
        // Update the cart total with the cost for this updated cart group of items
        this.total += cartItemGroup.item.price;
    }
};

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    cart: {type: Object, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// allows for pw hashing
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
});

userSchema.methods.encryptPassword = function(password)
{
    // receive plaintext pw and return hashed after 5 rounds of processing
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
    // compare the given password to the pw of the current user, the user on which this method is executed.
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', userSchema);
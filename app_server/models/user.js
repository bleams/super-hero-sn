var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// User schema according to our 'cahier de charges'
var UserSchema = new Schema({
    firstName : String,
    lastName : String,
    username : {
        type : String,
        required : true,
        index : { unique : true}
    },
    password: {
        type: String,
        required : true,
        select: false
    },
    email : String,
    gender : String,
    age : Number,
    location : String,
    //photoUrl : String,
    presentation : String,
    friends : [String],
    admin:  { type: Boolean, default: false }
});

// hash the password before the user is saved
// we use the Schema 'pre' method to have operations happen before an object is saved
UserSchema.pre('save', function (next) {
    var user = this;

    // hash the password only if password has been changed or if password is new
    if (!user.isModified('password'))
        return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if(err) return next(err);

        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

// return the model so we can access it in other files
module.exports = mongoose.model('User', UserSchema);


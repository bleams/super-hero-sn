var User = require('../../models/user'),
    jwt = require('jsonwebtoken'),
    superSecret = 'clarkKent',
    bcrypt = require('bcrypt-nodejs');


/* POST create a user */
module.exports.apiPost = function (req, res) {

    // create a new instance of the User model
    var user = new User();

    // set the user information (coming from the request)
    user.firstName = req.body.firstName;
    user.lastName= req.body.lastName;
    user.username = req.body.username;
    user.password = req.body.password;
    user.gender = req.body.gender;
    user.age = req.body.age;
    user.location = req.body.location;
    user.presentation = req.body.presentation;
    user.friends = req.body.friends;
    //user.admin = req.body.admin;

    // call the built-in save method on mongoose Models
    // to save the user to the database and checks for errors
    user.save(function (err) {
        if (err) {
            // duplicate entry
            if(err.code == 11000) {
                return res.json({
                    success : false,
                    message : "A user with that username already exists. "
                })
            } else return res.send(err);
        }

        res.json( {message : 'User created!' })
    });
};

/* GET find all users */
module.exports.apiGetAll = function (req, res) {
    User.find(function (err, users) {
        if(err){
            res.send(err)
        }
        // return the users
        res.json(users);
    });
};

/* GET find user by ID */
module.exports.apiGetUserById = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if(err){
            res.send(err);
        }
        // return that user
        res.json(user);
    });
};

/* PUT update user by ID */
module.exports.apiPut = function (req, res) {
    // use our model to find the user we want
    User.findById(req.params.user_id, function (err, user) {
        if(err) {
            res.send(err);
        }
        // update the users info only it it's new
        // (= only if changes are done, otherwise the unchanged fields would be updated with blank!)
        if(req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if(req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if(req.body.username) {
            user.username = req.body.username;
        }
        if(req.body.password) {
            user.password = req.body.password;
        }
        if(req.body.age) {
            user.age = req.body.age;
        }
        if(req.body.location) {
            user.location = req.body.location;
        }
        if(req.body.presentation) {
            user.presentation = req.body.presentation;
        }

        // call the built-in save method
        // to save the user
        user.save(function (err) {
            if(err){
                res.send(err);
            }
            // return a message
            res.json({message : 'User updated !'});
        })
    })
};

/* DELETE delete user by ID */
module.exports.apiDelete = function (req, res) {
    User.remove({
            _id: req.params.user_id
        },
        function (err, user) {
            if(err){
                res.send(err);
            }
            res.json({ message : user + " Successfully deleted" });
            console.log(user);
        });
};


// AUTHENTICATION FUNCTIONS ---------------

module.exports.apiPostAuth = function (req, res) {

    // find the user
    // select the firstName username and password explicitly
    User.findOne({
        username : req.body.username
    })
        .select('firstName username password')
        .exec(function (err, user) {
            if(err) throw err;
            // no user with that usermane was found
            if(!user){
                res.json({
                    success: false,
                    message: 'Authentification failed. User not found.'
                });
            } else if (user){
                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword){
                    res.json({
                        succes : false,
                        message : 'Authentification failed. Wrong password.'

                    });
                } else {
                    // if user found and password right
                    // then create token
                    var token = jwt.sign({
                        firstName: user.firstName,
                        username: user.username
                    }, superSecret, {
                        expiresInMinutes : 1440 // 24h
                    });

                    // return the info including token as JSON
                    res.json({
                        succes: true,
                        message : 'Tokenization went fine',
                        token: token
                    });
                }
            }
        });
};
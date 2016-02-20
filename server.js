// BASE SETUP
// ==================================

// CALL THE PACKAGES ---------------

var express = require('express');
var app = express();
var path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    port = process.env.PORT || 8080,
    User = require('./app_server/models/user');


// APP CONFIGURATION ---------------
// Use body parser so we can grab information from POST requests

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (local)
mongoose.connect('mongodb://localhost:27017/mean_machine');

// ROUTES FOR OUR API
// ==================================

// get an instance of the express router
var apiRouter = express.Router();

// middleware to use for all requests
apiRouter.use(function(req, res, next){
    console.log('Somebody just came to our app!');

    next();
});

// on routes that end in /users
// -----------------------------------
apiRouter.route('/users')
    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function (req, res) {

        // create a new instance of the User model
        var user = new User();

        // set the user information (comes from the request)
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        // save the user and checks for errors
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
    })
    .get(function (req, res) {
        User.find(function (err, users) {
            if(err){
                res.send(err)
            }
            // return the users
            res.json(users);
        });
    });

// on routes that end in /users/:user_id
// -----------------------------------

apiRouter.route('/users/:user_id')
    // get the user with that id
    // accessed at GET http://localhost:8080/api/users/:user_id
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if(err){
                res.send(err);
            }
            // return that user
            res.json(user);
        });
    })
    // update the user with this id
    // accessed at PUT http://localhost:8080/api/users/:user_id
    .put(function (req, res) {
        // use our model to find the user we want
        User.findById(req.params.user_id, function (err, user) {
            if(err) {
                res.send(err);
            }
            // update the users info only it it's new
            // (= only if changes are done, otherwise the unchanged fields would be updated with blank!)
            if(req.body.name) {
                user.name = req.body.name;
            }
            if(req.body.username) {
                user.username = req.body.username;
            }
            if(req.body.password) {
                user.password = req.body.password;
            }

            // save the user
            user.save(function (err) {
                if(err){
                    res.send(err);
                }
                // return a message
                res.json({message : 'User updated !'});
            })
        })
    })
    // delete the user with this id
    // (accessed at DELETE http://localhost:8080/api/users/user:id)
    .delete(function (req, res) {
        User.remove({
                _id: req.params.user_id
            },
            function (err, user) {
                if(err){
                    return res.send(err);
                }
                res.json({ message : "Successfully deleted" });
            });
    });

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api

apiRouter.get('/', function (req, res) {
    res.json({message : 'yeah! welcome to our api'});
});

// REGISTGER OUR ROUTES ---------------
// all of our routes will be prefixed with /api

app.use('/api', apiRouter);

// basic route for the home page
app.get('/', function (req, res) {
    res.send('Welcome to the home page !');
});


// START THE SERVER
// ==================================
app.listen(port);
console.log('Magic happens on port ' + port);
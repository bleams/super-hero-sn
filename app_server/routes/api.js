var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var apiCtrl = require('../controllers/api/api.ctrls');

// for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {
    // get an instance of the express router
    var apiRouter = express.Router();

    // route for the users authentification (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', apiCtrl.apiPostAuth);


// middleware to verify token for all requests
    apiRouter.use(function(req, res, next){

        // do logging
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if(token) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {
                if(err) {
                    return res.status(403).send({
                        success: false,
                        message : 'Failed to authenticate token.'
                    });
                } else {
                    // if everything ok, save to request for use in other routes
                    req.decoded = decoded;

                    //next();
                }
            });
        } else {
            // if no token, return an HTTP response of 403 (access forbidden)
            // and an error message

            return res.status(403).send({
                success : false,
                message : 'No token provided.'
            });
        }

        next();
    });

    // test route to make sure everything is working
// accessed at GET http://localhost:8080/api

    apiRouter.get('/', function (req, res) {
        res.json({message : 'yeah! welcome to our api'});
    });


// on routes that end in /users
// -----------------------------------
    apiRouter.route('/users')

        // create a user (accessed at POST http://localhost:8080/api/users)
        .post(apiCtrl.apiPost)

        .get(apiCtrl.apiGetAll);

// on routes that end in /users/:user_id
// -----------------------------------

    apiRouter.route('/users/:user_id')

        // get the user with that id
        // accessed at GET http://localhost:8080/api/users/:user_id
        .get(apiCtrl.apiGetUserById)

        // update the user with this id
        // accessed at PUT http://localhost:8080/api/users/:user_id
        .put(apiCtrl.apiPut)

        // delete the user with this id
        // (accessed at DELETE http://localhost:8080/api/users/user:id)
        .delete(apiCtrl.apiDelete);



// api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });

    return apiRouter;

}; // module.exports

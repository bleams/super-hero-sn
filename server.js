// BASE SETUP
// ==================================

// CALL THE PACKAGES ---------------

var express = require('express'),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';


// CALL THE MODULE.EXPORTS FILES ---------------
//var apiCtrl = require('./app_server/controllers/api/api.ctrls');
var config = require('./config');


// APP CONFIGURATION ---------------
// Use body parser to grab information from POST requests

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests (cross-origin resource sharing)
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (local)
//mongoose.connect('mongodb://localhost:27017/superapp');
if(env === 'development') {
    console.log('env', env);
    mongoose.connect('mongodb://localhost/superapp');
    app.locals.pretty = true;
} else {
    mongoose.connect(config.database);
}

console.log(__dirname);

// set static files location
// used for requests on the frontend
app.use(express.static(__dirname + '/public'));
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/controllers', express.static(__dirname + '/app/controllers'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/vendor', express.static(__dirname + '/public/assets/vendor'));
app.use('/pages', express.static(__dirname + '/public/app/views/pages'));
//app.use('/css', express.static(__dirname + '/css'));


// ROUTES FOR OUR API ===============
// ==================================

// API ROUTES ---------------
var apiRoutes = require('./app_server/routes/api')(app, express);

// REGISTGER OUR ROUTES -------------
// all of our routes will be prefixed with /api
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// Important : this catchall route has to be registered after API ROUTES
// since we only want it to catch routes not handled by Node
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'), function(){
        console.log('you are on the front end part');
    });
});


// START THE SERVER
// ==================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
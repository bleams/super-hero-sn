/**
 * Created by jimi on 02/02/2016.
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose');

// setting the environment varible
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

if(env === 'development') {
    mongoose.connect('mongodb://localhost/superapp');
} else {
    mongoose.connect('mongodb://geobleam:$obleam0@ds055905.mongolab.com:55905/superapp');
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('superapp db opened');
});

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function (err, messageDoc) {
    mongoMessage = messageDoc.message;
});


app.get('/partials/:partialPath', function (req, res) {
    res.render('partials/' + req.params.partialPath);
    console.log('partialPath ', req.params.partialPath);
});

app.get('*', function (req, res) {
    res.render('index', {
        mongoMessage: mongoMessage
    });
});

var port = process.env.PORT || 3030;
app.listen(port);

console.log('Listening on port ' + port + '...');



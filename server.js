// set up ======================================================================
var express  = require('express'),
	fs = require('fs');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var logfmt = require("logfmt");
app.use(logfmt.requestLogger());


// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = 'mongodb://localhost/error-log';
//'mongodb://errorlogger:P1ngraphy@768@ds033469.mongolab.com:33469/errorlogger';


//app.use(express.static('./public'));
app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});


// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

// define model ================================================================
var Log = mongoose.model('Log', {
	title : String,
	description : String,
	author : String,
	date : String
});

// routes ======================================================================

	// api ---------------------------------------------------------------------
	// get all logs
	app.get('/api/logs', function(req, res) {

		// use mongoose to get all todos in the database
		Log.find(function(err, logs) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(logs); // return all error logs in JSON format
		});
	});

	// get log by id
	app.get('/api/logs/:log_id', function(req, res) {

		// use mongoose to get all todos in the database
		Log.find({
			_id : req.params.log_id
		}, function(err, log) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(log); // return all error logs in JSON format
		});
	});

	// create log and send back all todos after creation
	app.post('/api/logs', function(req, res) {

		// create a log, information comes from AJAX request from Angular
		Log.create({
			title : req.body.title,
			description : req.body.description,
			author : req.body.author,
			date : req.body.date
		}, function(err, log) {
			if (err)
				res.send(err);

			// get and return all the logs after you create another
			Log.find(function(err, logs) {
				if (err)
					res.send(err)
				res.json(logs);
			});
		});

	});

	// delete a log
	app.delete('/api/logs/:log_id', function(req, res) {
		Log.remove({
			_id : req.params.log_id
		}, function(err, log) {
			if (err)
				res.send(err);

			// get and return all the logs after you create another
			Log.find(function(err, logs) {
				if (err)
					res.send(err)
				res.json(logs);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

// listen (start app with node server.js) ======================================
var port = Number(process.env.PORT || 8000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

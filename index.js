var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var path = require('path');

var app = express();

var route = require('./routes');

//Connect MongoDB
mongoose.connect("mongodb://localhost/vrmaps", {
	useMongoClient: true
});

//on connection
mongoose.connection.on('connected',(err) => {
	console.log("connected to db");
});
mongoose.connection.on('error', (err) => {
	if(err){ console.log("err"); }	
});

//static files
//app.use(express.static(__dirname + "/public_html"));

//routes
app.use('/', route);

app.listen(3000, function() {
	console.log("Serving on port 3000");
});
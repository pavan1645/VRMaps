var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var cors = require('cors');
var path = require('path');

var q = require('q');

var app = express();

var Pano = require("./models/pano");
var Marker = require("./models/marker");
var route = require('./routes');

var graphObj = require('./graph');
graphObj.addNode("pano1","pano2");
graphObj.addNode("pano2", "pano3");
graphObj.addNode("pano2", "pano4");
graphObj.addNode("pano4","pano5");
console.log(graphObj.getPath("pano1","pano5"));

//Connect MongoDB
mongoose.connect("mongodb://localhost/vrmaps", {
	useMongoClient: true
});
mongoose.Promise = q.Promise;

//on connection
mongoose.connection.on('connected',(err) => {
	console.log("connected to db");
});
mongoose.connection.on('error', (err) => {
	if(err){ console.log("err"); }	
});

/*Body and Files Config*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Adding middleware - cors
app.use(cors());

//static files
app.use(express.static(path.join(__dirname, 'dist')));

//routes
app.use('/api/', route);

app.listen(3000, function() {
	console.log("Serving on port 3000");
});
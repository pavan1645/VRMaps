var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var cors = require('cors');
var path = require('path');

var q = require('q');

var Pano = require("./models/pano");
var Marker = require("./models/marker");

var markerRoutes = require('./routes/marker');
var panoRoutes = require('./routes/pano');
var pathRoutes = require('./routes/path');

var seedDB = require("./seeds");

var app = express();
seedDB();

//Connect MongoDB
//var mongoURL = "mongodb://admin:1234@ds229458.mlab.com:29458/vrmaps";
var mongoURL = "mongodb://localhost/vrmaps"
mongoose.connect(mongoURL, {
	useMongoClient: true
});
mongoose.Promise = q.Promise;

//on connection
mongoose.connection.on('connected',(err) => {
	console.log("connected to db");
});
mongoose.connection.on('error', (err) => {
	if(err){ console.log("err: "+err); }	
});

/*Body and Files Config*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Adding middleware - cors
app.use(cors());

//static files
app.use(express.static(path.join(__dirname, 'dist')));

//routes
app.use('/api/', markerRoutes);
app.use('/api/', panoRoutes);
app.use('/api/', pathRoutes);

app.listen(process.env.PORT || 3000, function() {
	console.log("Serving on port 3000");
});
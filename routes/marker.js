var express = require('express');
var router = express.Router();

var Pano = require("../models/pano");
var Marker = require("../models/marker");

//Add marker
router.post("/marker", function (req, res) {
	var marker = new Marker({
		image_id: req.body.image_id,
		tooltip_content: req.body.tooltip_content
	});
	marker.save()
	.then((marker) => {
		//Create an empty pano for the same
		let pano = new Pano({
			id: marker.image_id,
			markers: []
		});
		pano.save()
		.then((pano) => {
			console.log("Empty pano created \n"+pano)
			res.send(marker)
		});
	})
	.catch((err) => res.json({"error":"Marker already exists"}));
});

//Get all markers
router.get("/marker", function (req, res) {
	Marker.find({}).select("-_id -__v").exec((err, markers) => {
		res.json(markers);
	});
});

//Get single marker
router.get("/marker/:image_id", function (req, res) {
	Marker.find({ "image_id": req.params.image_id }).exec((err, marker) => {
		res.json(marker);
	});
});

//updating the whole marker
router.post("/marker/:id", (req, res) => {
	Marker.find({ "image_id": req.params.id }).exec()
	.then((marker) => {
		marker[0].image_id = req.params.id;
		marker[0].tooltip_content = req.body.tooltip_content;
		marker[0].save()
		.then((x) => {
			res.send(x);
		});
	})
	.catch((err) => res.json({"error":"No such marker"}));
});

module.exports = router;
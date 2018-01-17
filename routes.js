var express = require('express');
var router = express.Router();
var Q = require('q');

var Pano = require("./models/pano");
var Marker = require("./models/marker");

router.get("/pano/:image_id", function (req, res) {
	Pano.find({ "id": req.params.image_id }).populate("markers.info").exec((err, pano) => {
		res.send(pano);
	})
});


function deletePano (idd) {
	return Pano.deleteOne({ id: idd }).exec()
	.then((res) => { console.log("Deleted " + res.deletedCount); })
	.catch((err) => console.log(err));
}

function getMarkerId(image_id) {
	return Marker.find({ image_id: image_id }).exec()
	.then((marker) => {
		return marker[0]._id;
	})
	.fail((err) => console.log(err));
}

function getAllMarkerId(markers) {
	return new Promise(function (resolve, reject) {
		markers.forEach(function (marker, index) {
			getMarkerId(marker.image_id)
			.then((_id) => {
				delete marker.image_id;
				marker.info = _id;
				if (index == markers.length -1) {
					resolve(markers);
				}
			});
		});
	});
}

//Create pano
router.post("/pano", function (req, res) {
	let pano = new Pano({
		id: req.body.id,
		markers: []
	});
	let markers = req.body.markers;
	let promise1 = getAllMarkerId(markers);
	let promise2 = deletePano(req.body.id);
	
	Promise.all([promise1, promise2])
	.then((values) => {
		markers = values[0];
		pano.save()
		.then((res) => pano = res);
		pano.markers = markers;
		pano.save()
		.then((pano) => res.json(pano))
	});
});

router.get("/marker", function (req, res) {
	Marker.find()
	res.json({ "code": 202 });
});

//Create marker
router.post("/marker", function (req, res) {
	var marker = new Marker({
		image_id: req.body.image_id,
		tooltip_content: req.body.tooltip_content
	});
	marker.save( (err, marker) => {
		if (err) {
			res.send(err);
		} else {
			res.send("Created marker " + marker);
		}
	});
});

module.exports = router;
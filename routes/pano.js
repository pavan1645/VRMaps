var express = require('express');
var router = express.Router();

var Pano = require("../models/pano");
var Marker = require("../models/marker");
var Graph = require("../graph");

function deletePano(idd) {
	return Pano.deleteOne({ id: idd }).exec()
	.then((res) => { console.log("Deleted " + res.deletedCount); })
	.catch((err) => console.log(err));
}

function getMarkerId(image_id) {
	return Marker.find({ image_id: image_id }).exec()
	.then((marker) => {
		return marker[0]._id;
	})
	.catch((err) => {
		console.log(err);
		return null;
	});
}

function getAllMarkerId(markers) {
	return new Promise(function (resolve, reject) {
		markers.forEach(function (marker, index) {
			getMarkerId(marker.image_id)
			.then((_id) => {
				delete marker.image_id;
				marker.info = _id;
				if (index == markers.length - 1) {
					resolve(markers);
				}
			})
			.catch((err) => console.log(err));
		});
		resolve(null);
	});
}

//Get single pano
router.get("/pano/:image_id", function (req, res) {
	Pano.find({ "id": req.params.image_id }).populate("markers.info").exec()
	.then((pano) => res.send(pano))
	.catch((err) => res.json({"error":"No such pano!"}))
});

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
		if(values[0]) markers = values[0];
		pano.save()
		.then((res) => pano = res);
		pano.markers = markers;
		pano.save()
		.then((pano) => {
			console.log("Pano saved: \n"+pano)
			res.json(pano)
		})
	});
});

//Add marker to pano
router.post("/pano/:id/marker", (req, res) => {
	Marker.find({ "image_id": req.body.image_id }).exec()
	.then((retMarker) => {
		let marker = retMarker[0];
		Pano.find({ "id": req.params.id }).exec()
		.then((pano) => {
			//removes marker if already exists
			for (var i = 0; i < pano[0].markers.length; i++) {
				if (String(pano[0].markers[i].info) == String(marker._id)) {
					pano[0].markers.splice(i, 1);
					break;
				}
			}
			//add marker to markers array
			pano[0].markers.push({
				info: marker._id,
				latitude: req.body.latitude,
				longitude: req.body.longitude
			});
			pano[0].save()
			.then((pano) => {
				pano.populate("markers.info").execPopulate()
				.then((pano) => {
					console.log("Pano saved: \n" + pano);
					Graph.addNode(req.params.id, req.body.image_id);
					res.send(pano)
				})
			});
		})
		.catch((err) => res.json({"error":"No Pano exists."}))
	})
	.catch((err) => res.json({"error": "No Marker exists."}))
});


module.exports = router;



/*For adding/updating whole pano--- FOR DEV*/
//Pano.marker.info stores _id not image id.. Update the same!
/* router.post("/pano/:id", (req, res) => {
	Pano.find({ "id": req.params.id }).exec()
	.then((pano) => {
		pano[0].id = req.params.id;
		pano[0].markers = req.body.markers;
		pano[0].save()
		.then((x) => {
			res.send(x);
		});
	});
}); */

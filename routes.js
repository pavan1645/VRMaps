var express = require('express');
var router = express.Router();

var Pano = require("./models/pano");
var Marker = require("./models/marker");

//Get single pano
router.get("/pano/:image_id", function (req, res) {
	Pano.find({ "id": req.params.image_id }).populate("markers.info").exec((err, pano) => {
		res.send(pano);
	})
});

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
	.fail((err) => console.log(err));
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

router.post("/pano/:id/marker",(req,res) =>{
	var marker = new Marker({
		image_id: req.body.image_id,
		tooltip_content: req.body.tooltip_content
	});
	Marker.find({ "image_id": req.body.image_id}).exec()
	.then((retMarker) => {
		if (retMarker[0]) {
			marker = retMarker[0];
		}
	})
	.catch((err) => console.log(err))
	.then(() => {
		console.log(marker);
		marker.save()
		.then((marker) => {
			Pano.find({ "id": req.params.id }).exec()
			.then((pano) => {
				pano[0].markers.push({
					info: marker._id,
					latitude: req.body.latitude,
					longitude: req.body.longitude
				});
				pano[0].save()
				.then((pano) => {
					res.send(pano);
				});
			})
		})
		.catch((err) => console.log(err));
	})
});

router.post("/marker", function (req, res) {
	var marker = new Marker({
		image_id: req.body.image_id,
		tooltip_content: req.body.tooltip_content
	});
	marker.save()
	.then((res) => res.send(marker) )
	.catch((err) => console.log(err) );
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
		console.log(marker);
		marker[0].image_id = req.params.id;
		marker[0].tooltip_content = req.body.tooltip_content;
		marker[0].save()
		.then((x) => {
			res.send(x);
		});
	});
});
module.exports = router;
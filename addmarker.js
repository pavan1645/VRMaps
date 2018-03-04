
var Pano = require("./models/pano");
var Marker = require("./models/marker");

function addmarker(body) {
	var marker = new Marker({
		image_id: body.image_id,
		tooltip_content: body.tooltip_content
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
			console.log("Empty pano created \n" + pano)
			res.send(marker)
		});
	})
	.catch((err) => res.json({ "error": "Marker already exists" }));
}

module.exports = addmarker;
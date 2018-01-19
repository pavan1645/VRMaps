var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
	console.log("/ called");
	res.render("public_html/index");
	loadPSV();
});

function loadPSV() {
	console.log("psv called");
	var viewer = new PhotoSphereViewer({
		container: document.getElementById('psv'),
		panorama: 'pano.jpg',
		time_anim: false,
		size: {
			height: 700
		},
		navbar: [
		'autorotate',
		'zoom',
		'markers',
		'caption',
		'fullscreen'
		],
		markers: [{
			// polygon marker
			id: 'polygon',
			polygon_px: [4089,2002,4220,1998,4218,2218,4087,2214],
			svgStyle: {
				fill: 'rgba(200, 0, 0, 0.2)',
				stroke: 'rgba(200, 0, 50, 0.8)',
				'stroke-width': '2px'
			},
			tooltip:{
				content: 'Room no. 602 : IT Dept.Staff Room',
				position: 'bottom center'
			},
			content:document.getElementById('itdeptdesc').innerHTML
 		}]
	});
}

module.exports = router;
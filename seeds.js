var graphObj = require('./graph');

function seedDB() {
	graphObj.addNode("pano3", "pano1");
	graphObj.addNode("pano1", "pano4");
	graphObj.addNode("pano4", "pano1");
	graphObj.addNode("pano1", "pano3");
	graphObj.addNode("pano4", "pano5");
	graphObj.addNode("pano5", "pano4");
	graphObj.addNode("pano1", "pano6");
	graphObj.addNode("pano6", "pano1");
	graphObj.addNode("pano6", "pano7");
	graphObj.addNode("pano7", "pano8");
	graphObj.addNode("pano8", "pano7");
	graphObj.addNode("pano8", "pano9");
	graphObj.addNode("pano9", "pano8");
	graphObj.addNode("pano7", "pano6");
	graphObj.addNode("pano1", "pano4");
	graphObj.addNode("pano4", "pano1");
	graphObj.addNode("pano4", "pano5");
	graphObj.addNode("pano5", "pano4");
}

module.exports = seedDB;
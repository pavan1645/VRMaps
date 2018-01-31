const Graph = require('node-dijkstra')

var graphObj = {};
const graph = new Graph();

graphObj.addNode = function (node1, node2) {
	let map = new Map();
	if(graph.graph.get(node1)) map = graph.graph.get(node1);
	map.set(node2, 1);
	graph.addNode(node1, map);
	console.log("Node added "+node1+"-->"+node2);
}
graphObj.getPath = function (node1, node2) {
	return new Promise((resolve, reject) => {
		resolve(graph.path(node1, node2));
	})
}

module.exports = graphObj;
const Graph = require('node-dijkstra')

var graphObj = {};
const graph = new Graph();

graphObj.addNode = function (node1, node2) {
	const map = new Map()
	map.set(node2, 1);
	graph.addNode(node1, map);
}
graphObj.getPath = function (node1, node2) {
	return graph.path(node1, node2);
}

module.exports = graphObj;
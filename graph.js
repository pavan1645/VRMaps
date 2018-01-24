const Graph = require('node-dijkstra')
/* const map = new Map()

const a = new Map()
a.set('B', 1)

const b = new Map()
b.set('A', 1)
b.set('C', 2)
b.set('D', 4)

map.set('A', a)
map.set('B', b);
const graph = new Graph(map);

console.log(map);
console.log(graph);
 */

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
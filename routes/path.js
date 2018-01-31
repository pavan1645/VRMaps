var express = require('express');
var router = express.Router();

var Pano = require("../models/pano");
var Marker = require("../models/marker");
var Graph = require("../graph");

router.get("/path/:node1/:node2", (req, res) => {
	Graph.getPath(req.params.node1, req.params.node2)
	.then((path) => {
		if(path) res.send(path)
		else res.json({"error":"Wrong input"})
	})
})

module.exports = router;
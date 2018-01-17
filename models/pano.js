var mongoose = require("mongoose");
var pano = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		index: true,
		required: true
	},
	markers: [{
		info: { type: mongoose.Schema.Types.ObjectId, ref: 'Marker' },
		latitude: String,
		longitude: String
	}]
}, { strict: true });
module.exports = mongoose.model("Pano", pano);

var mongoose = require("mongoose");
var marker = new mongoose.Schema({
	image_id: {
		type: String,
		required: true,
		index: true,
		unique: true
	},
	tooltip_content: String
}, { strict: true });
module.exports = mongoose.model("Marker", marker);

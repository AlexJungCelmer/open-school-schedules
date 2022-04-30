const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
	name: { type: String, default: null },
	classe: {type: String},
	school: {type: String},
	subjects: {type: Array},
	shift: {
		type: String,
		enum: ['manhã', 'tarde', 'noite'],
		default: 'manhã'
	},
});

module.exports = mongoose.model("schedule", scheduleSchema);
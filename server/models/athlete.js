const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Athlete', athleteSchema);

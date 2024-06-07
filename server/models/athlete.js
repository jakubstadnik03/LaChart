const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  Easy: [String],
  lt1: [String],
  l3: [String],
  lt2: [String],
  vo2: [String]
});

const athleteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: false },
  sport: { type: String, required: false },
  personalBests: [String],
  injuries: [String],
  bikeZones: { type: zoneSchema, required: false },
  runZones: { type: zoneSchema, required: false }
});

module.exports = mongoose.model('Athlete', athleteSchema);

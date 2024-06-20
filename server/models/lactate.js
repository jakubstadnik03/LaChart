// models/TestingModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LactateSchema = new Schema({
  athleteId: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  sport: { type: String, required: true },
  bikeType: { type: String },
  poolLength: { type: String },
  terrain: { type: String },
  description: { type: String },
  effort: { type: Number, required: true },
  weather: { type: String },
  indoorOutdoor: { type: String },
  testings: [
    {
      power: { type: Number, required: true },
      heartRate: { type: Number, required: true },
      intervalLength: { type: String, required: true },
      effort: { type: Number, required: true },
      lactate: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Lactate", LactateSchema);

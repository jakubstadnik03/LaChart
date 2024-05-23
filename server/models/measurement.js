const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  power: Number,
  lactate: Number,
  heartRate: Number,
}, { _id: false }); // Prevents Mongoose from creating a separate _id for subdocuments

const measurementSchema = new mongoose.Schema({
  athleteId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing athletes
    required: true,
    ref: 'Athlete'
  },
  date: {
    type: Date,
    default: Date.now // Automatically set to current date & time
  },
  sport: String,
  indoorOutdoor: String, // Added field for environment setting
  weight: Number, // Added field for weight to track conditions or changes
  typeOfShoes: String, // Optional, only relevant for running
  bikeType: String, // Optional, only relevant for cycling
  poolLength: Number, // Optional, only relevant for swimming
  description: String,
  points: [pointSchema],
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Measurement', measurementSchema);

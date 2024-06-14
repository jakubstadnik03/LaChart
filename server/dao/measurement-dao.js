// dao/measurementDAO.js
const Measurement = require("../models/measurement");

async function createMeasurement(measurementData) {
  const measurement = new Measurement(measurementData);
  return measurement.save();
}

async function getMeasurementsByAthleteId(athleteId) {
  return Measurement.find({ athleteId: athleteId });
}

async function getMeasurementById(id) {
  return Measurement.findById(id);
}

async function updateMeasurement(id, updateData) {
  return Measurement.findByIdAndUpdate(id, updateData, { new: true });
}
async function deleteMeasurement(id) {
  return Measurement.findByIdAndDelete(id); // Modify according to your DB API
}

module.exports = {
  createMeasurement,
  getMeasurementsByAthleteId,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement,
};

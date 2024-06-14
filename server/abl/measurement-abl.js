// abl/measurementABL.js
const measurementDAO = require('../dao/measurement-dao');

async function createMeasurement(measurementData) {
  return measurementDAO.createMeasurement(measurementData);
}

async function getMeasurementsByAthleteId(athleteId) {
  return measurementDAO.getMeasurementsByAthleteId(athleteId);
}

async function getMeasurementById(id) {
  return measurementDAO.getMeasurementById(id);
}

async function updateMeasurement(id, updateData) {
  return measurementDAO.updateMeasurement(id, updateData);
}
async function deleteMeasurement(id) {
  return measurementDAO.deleteMeasurement(id);
}

module.exports = {
  createMeasurement,
  getMeasurementsByAthleteId,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement
};

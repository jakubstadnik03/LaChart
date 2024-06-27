// athleteDAO.js
const Athlete = require("../models/athlete");

async function create(data) {
  const athlete = new Athlete(data);
  return athlete.save();
}

async function findAll() {
  return Athlete.find();
}

async function findById(id) {
  return Athlete.findById(id);
}

async function update(id, data) {
  return Athlete.findByIdAndUpdate(id, data, { new: true });
}

async function listByUserId(userId) {
  return Athlete.find({ userId: userId });
}
async function listByCoachId(userId) {
  return Athlete.find({ coachId: userId });
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  listByUserId,
  listByCoachId,
};

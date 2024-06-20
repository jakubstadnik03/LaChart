// dao/TestingDAO.js
const Testing = require("../models/lactate");

class LactateDAO {
  async createTesting(data) {
    const newTesting = new Testing(data);
    return newTesting.save();
  }

  async getTestingsByAthlete(athleteId) {
    return Testing.find({ athleteId });
  }

  async getTestingById(id) {
    return Testing.findById(id);
  }

  async updateTesting(id, updateData) {
    return Testing.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteTesting(id) {
    return Testing.findByIdAndDelete(id);
  }
}

module.exports = new LactateDAO();

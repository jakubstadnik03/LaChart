// abl/TestingABL.js
const LactateDAO = require("../../dao/lactate-dao");

class TestingABL {
  async createTesting(data) {
    return LactateDAO.createTesting(data);
  }

  async getTestingsByAthlete(athleteId) {
    return LactateDAO.getTestingsByAthlete(athleteId);
  }

  async getTestingById(id) {
    return LactateDAO.getTestingById(id);
  }

  async updateTesting(id, updateData) {
    return LactateDAO.updateTesting(id, updateData);
  }

  async deleteTesting(id) {
    return LactateDAO.deleteTesting(id);
  }
}

module.exports = new TestingABL();

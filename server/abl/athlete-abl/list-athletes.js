const athleteDAO = require('../../dao/athlete-dao');

async function listAthletes(req, res) {
  try {
    const athletes = await athleteDAO.findAll();
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = listAthletes;

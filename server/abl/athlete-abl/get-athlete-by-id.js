const athleteDAO = require('../../dao/athlete-dao');

async function getAthleteById(req, res) {
  try {
    const athlete = await athleteDAO.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = getAthleteById;

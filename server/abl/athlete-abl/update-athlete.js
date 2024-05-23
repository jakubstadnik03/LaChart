const athleteDAO = require('../../dao/athlete-dao');

async function updateAthlete(req, res) {
  try {
    const update = req.body;
    const updatedAthlete = await athleteDAO.update(req.params.id, update);
    if (!updatedAthlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(updatedAthlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = updateAthlete;

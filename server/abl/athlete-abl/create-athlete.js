const athleteDAO = require('../../dao/athlete-dao');

async function createAthlete(req, res) {
  try {
    const userId = req.user.id;
    const athleteData = { ...req.body, userId };
    const athlete = await athleteDAO.create(athleteData);
    res.status(201).json(athlete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = createAthlete;

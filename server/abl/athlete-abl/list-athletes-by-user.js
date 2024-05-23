// Assuming athleteABL.js or a similar ABL file

const athleteDAO = require('../../dao/athlete-dao');

async function listAthletesByUser(req, res) {
  try {
    const userId = req.user.id; // ID from JWT payload set by verifyToken middleware
    const athletes = await athleteDAO.findByUserId(userId);
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = listAthletesByUser;

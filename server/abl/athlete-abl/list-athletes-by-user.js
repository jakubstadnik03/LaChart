// ABL file for handling listing athletes by user
const athleteDAO = require('../../dao/athlete-dao');

async function listAthletesByUser(req, res) {
  try {
    const athletes = await athleteDAO.findAll();
    res.json(athletes);  // Response is handled here
  } catch (error) {
    // This ensures that any error in processing is caught and sent as a server error response.
    console.error("Error fetching athletes:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = listAthletesByUser;

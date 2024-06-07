const athleteDAO = require('../../dao/athlete-dao');

async function ListAllAbl(req, res) {
    // Check for authenticated user
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        // Retrieve all athletes for the logged-in user
        const athletes = await athleteDAO.listByUserId(req.user.id);

        // Return the list of athletes
        res.json(athletes);
    } catch (error) {
        console.error("Error in ListAllAbl:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = ListAllAbl;

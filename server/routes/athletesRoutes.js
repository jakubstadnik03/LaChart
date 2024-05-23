const express = require('express');
const router = express.Router();
const createAthlete = require('../abl/athlete-abl/create-athlete');
const listAthletes = require('../abl/athlete-abl/list-athletes');
const getAthleteById = require('../abl/athlete-abl/get-athlete-by-id');
const updateAthlete = require('../abl/athlete-abl/update-athlete');
const listAthletesByUser = require('../abl/athlete-abl/list-athletes-by-user');
const verifyToken = require('../middleware/verifyToken');

// POST /athletes - Create a new athlete
router.post('/', verifyToken, async (req, res) => {
  try {
    const athlete = await createAthlete(req, res);
    res.status(201).json(athlete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /athletes - List all athletes
router.get('/', verifyToken, async (req, res) => {
  try {
    const athletes = await listAthletes(req, res);
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /athletes/:id - Get an athlete by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const athlete = await getAthleteById(req, res);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /athletes/:id - Update an athlete
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedAthlete = await updateAthlete(req, res);
    if (!updatedAthlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(updatedAthlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /athletes/listByUser/:userId - List athletes by user ID
router.get('/listByUser', verifyToken, async (req, res) => {
  try {
    const athletes = await listAthletesByUser(req, res);
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

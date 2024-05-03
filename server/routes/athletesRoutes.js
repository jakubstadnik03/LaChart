const express = require('express');
const router = express.Router();
const athleteService = require('../services/athleteService');
const Athlete = require('../models/athlete');

// POST /athletes - Create a new athlete
// POST /athletes - Create a new athlete
router.post('/', async (req, res) => {
    const athlete = new Athlete({
      name: req.body.name,
    });
  
    try {
      const newAthlete = await athlete.save();
      res.status(201).json(newAthlete);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
// GET /athletes - Get all athletes
router.get('/', async (req, res) => {
  try {
    const athletes = await athleteService.getAllAthletes();
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {
    try {
      const athlete = await Athlete.findById(req.params.id);
      if (!athlete) {
        return res.status(404).json({ message: 'Athlete not found' });
      }
      res.json(athlete);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;

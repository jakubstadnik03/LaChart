const express = require('express');
const router = express.Router();
const Measurement = require('../models/measurement');
const measurementService = require('../services/measurementService');

// POST /measurements - Create a new measurement
router.post('/', async (req, res) => {
  try {
    const measurement = await measurementService.createMeasurement(req.body);
    res.status(201).json(measurement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /measurements/:athleteId - Get measurements for an athlete
router.get('/:athleteId', async (req, res) => {
  try {
    const measurements = await measurementService.getMeasurementsByAthleteId(req.params.athleteId);
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/measurement/:id', async (req, res) => {
    try {
      const measurement = await Measurement.findById(req.params.id);
      console.log(req.params.id);
      if (!measurement) {
        return res.status(404).json({ message: 'Measurement not found' });
      }
      res.json(measurement);
    } catch (error) {
      // This catches and responds to any errors, including invalid ObjectId errors
      res.status(500).json({ message: error.message });
    }
  });
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const update = req.body;
      
      // Option `{ new: true }` ensures the updated document is returned
      const updatedMeasurement = await Measurement.findByIdAndUpdate(id, update, { new: true });
      if (!updatedMeasurement) {
        return res.status(404).json({ message: 'Measurement not found' });
      }
      res.json(updatedMeasurement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// POST /measurements - Create a new measurement
router.post('/', async (req, res) => {
  const measurement = new Measurement({
    athleteId: req.body.athleteId,
    sport: req.body.sport,
    description: req.body.description,
    points: req.body.points,
    // date is automatically set to current date and time
  });

  try {
    const newMeasurement = await measurement.save();
    res.status(201).json(newMeasurement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

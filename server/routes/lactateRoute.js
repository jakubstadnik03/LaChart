// routes/testingRoutes.js
const express = require("express");
const router = express.Router();
const TestingABL = require("../abl/lactate-abl/TestingABL");

// Create a new testing
router.post("/", async (req, res) => {
  try {
    const newTesting = await TestingABL.createTesting(req.body);
    res.status(201).json(newTesting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all testings for an athlete
router.get("/athlete/:athleteId", async (req, res) => {
  try {
    const testings = await TestingABL.getTestingsByAthlete(
      req.params.athleteId
    );
    res.status(200).json(testings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific testing by ID
router.get("/:id", async (req, res) => {
  try {
    const testing = await TestingABL.getTestingById(req.params.id);
    if (!testing) {
      return res.status(404).json({ message: "Testing not found" });
    }
    res.status(200).json(testing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a testing
router.put("/:id", async (req, res) => {
  try {
    const updatedTesting = await TestingABL.updateTesting(
      req.params.id,
      req.body
    );
    if (!updatedTesting) {
      return res.status(404).json({ message: "Testing not found" });
    }
    res.status(200).json(updatedTesting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a testing
router.delete("/:id", async (req, res) => {
  try {
    const deletedTesting = await TestingABL.deleteTesting(req.params.id);
    if (!deletedTesting) {
      return res.status(404).json({ message: "Testing not found" });
    }
    res.status(200).json({ message: "Testing deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

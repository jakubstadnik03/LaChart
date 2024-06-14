const express = require("express");
const router = express.Router();
const measurementABL = require("../abl/measurement-abl");
const verifyToken = require("../middleware/verifyToken");

// POST /measurements - Create a new measurement
router.post("/", async (req, res) => {
  try {
    const measurement = await measurementABL.createMeasurement(req.body);
    res.status(201).json(measurement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /measurements/:athleteId - Get measurements for an athlete
router.get("/:athleteId", verifyToken, async (req, res) => {
  try {
    const measurements = await measurementABL.getMeasurementsByAthleteId(
      req.params.athleteId
    );
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /measurement/:id - Get a specific measurement
router.get("/measurement/:id", verifyToken, async (req, res) => {
  try {
    const measurement = await measurementABL.getMeasurementById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    res.json(measurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /measurements/:id - Update a measurement
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedMeasurement = await measurementABL.updateMeasurement(
      req.params.id,
      req.body
    );
    if (!updatedMeasurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    res.json(updatedMeasurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await measurementABL.deleteMeasurement(req.params.id);
    if (!result) {
      console.log("eereriwjiofhrdoihdfio");
      return res.status(404).json({ message: "Measurement not found" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

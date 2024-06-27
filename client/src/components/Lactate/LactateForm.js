import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  IconButton,
  Slider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { createLactate } from "../../apiService";

const LactateForm = ({ onSave, selectedAthleteId }) => {
  const [formData, setFormData] = useState({
    date: "",
    athleteId: selectedAthleteId,
    sport: "bike",
    testings: [
      {
        power: "",
        heartRate: "",
        pace: "", // Single field for pace in mm:ss format
        measurementType: "time", // New field to choose between time or distance
        effort: 10,
        lactate: "",
      },
    ],
    weather: "",
    bikeType: "",
    poolLength: "",
    terrain: "",
    description: "",
    weather: "",
    indoorOutdoor: "",
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, date: getCurrentDateTime() }));
  }, []);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    if (typeof index === "number") {
      let newTestings = [...formData.testings];
      newTestings[index][name] = value;

      // Convert pace to seconds if sport is run or swim
      if (formData.sport === "run" || formData.sport === "swim") {
        if (name === "pace") {
          const [minutes, seconds] = value.split(":").map(Number);
          newTestings[index].power = minutes * 60 + seconds;
        }
      }

      setFormData((prev) => ({ ...prev, testings: newTestings }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTesting = () => {
    let newTesting = {
      power: "",
      heartRate: "",
      pace: "",
      measurementType: "time",
      effort: 10,
      lactate: "",
    };
    setFormData((prev) => ({
      ...prev,
      testings: [...prev.testings, newTesting],
    }));
  };

  const handleRemoveTesting = (index) => {
    let newTestings = [...formData.testings];
    if (newTestings.length > 1) {
      newTestings.splice(index, 1);
      setFormData((prev) => ({ ...prev, testings: newTestings }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createLactate(formData);
      window.location.reload(); // Reload the page after successful creation
    } catch (error) {
      console.error("Failed to create lactate data", error);
      // Handle the error appropriately here, e.g., showing an error message to the user
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Enter Lactate Testing Details
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            name="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Sport</InputLabel>
            <Select
              name="sport"
              value={formData.sport}
              label="Sport"
              onChange={handleChange}
            >
              <MenuItem value="bike">Bike</MenuItem>
              <MenuItem value="run">Run</MenuItem>
              <MenuItem value="swim">Swim</MenuItem>
            </Select>
          </FormControl>
          {formData.testings.map((testing, index) => (
            <Grid container spacing={2} key={index}>
              {formData.sport === "bike" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Power (W)"
                    name="power"
                    type="number"
                    value={testing.power}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pace (mm:ss)"
                    name="pace"
                    value={testing.pace}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Heart Rate (bpm)"
                  name="heartRate"
                  type="number"
                  value={testing.heartRate}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Measurement Type</InputLabel>
                  <Select
                    name="measurementType"
                    value={testing.measurementType}
                    label="Measurement Type"
                    onChange={(e) => handleChange(e, index)}
                  >
                    <MenuItem value="time">Time</MenuItem>
                    <MenuItem value="distance">Distance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {testing.measurementType === "time" ? (
                <>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Minutes"
                      name="minutes"
                      type="number"
                      value={testing.minutes}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Seconds"
                      name="seconds"
                      type="number"
                      value={testing.seconds}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Distance (km)"
                    name="distance"
                    type="number"
                    value={testing.distance}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Effort (1-20)</Typography>
                <Slider
                  value={testing.effort}
                  onChange={(e, newVal) =>
                    handleChange(
                      { target: { name: "effort", value: newVal } },
                      index
                    )
                  }
                  aria-labelledby="effort-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={20}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lactate (mmol/L)"
                  name="lactate"
                  type="number"
                  value={testing.lactate}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton
                  onClick={() => handleRemoveTesting(index)}
                  color="error"
                >
                  <RemoveCircleIcon />
                </IconButton>
                {index === formData.testings.length - 1 && (
                  <IconButton onClick={handleAddTesting} color="primary">
                    <AddCircleIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <TextField
            fullWidth
            label="Weather"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            margin="normal"
          />
          {formData.sport === "bike" && (
            <TextField
              fullWidth
              label="Bike Type"
              name="bikeType"
              value={formData.bikeType}
              onChange={handleChange}
              margin="normal"
            />
          )}
          {formData.sport === "swim" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Pool Length</InputLabel>
              <Select
                name="poolLength"
                value={formData.poolLength}
                label="Pool Length"
                onChange={handleChange}
              >
                <MenuItem value="25">25m</MenuItem>
                <MenuItem value="50">50m</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          )}
          {formData.sport === "run" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Terrain</InputLabel>
              <Select
                name="terrain"
                value={formData.terrain}
                label="Terrain"
                onChange={handleChange}
              >
                <MenuItem value="flat">Flat Road</MenuItem>
                <MenuItem value="hilly">Hilly</MenuItem>
                <MenuItem value="track">Track</MenuItem>
                <MenuItem value="treadmill">Treadmill</MenuItem>
                <MenuItem value="cross">Cross</MenuItem>
              </Select>
            </FormControl>
          )}
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save Testing
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LactateForm;

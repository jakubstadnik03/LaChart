import React, { useState } from "react";
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

const LactateForm = ({ onSave, selectedAthleteId }) => {
  const [formData, setFormData] = useState({
    date: "",
    athleteId: selectedAthleteId,
    testings: [
      {
        power: "",
        heartRate: "",
        minutes: "", // Default 4 minutes
        seconds: "", // Default 30 seconds
        effort: 10,
        lactate: "",
      },
    ],
    weather: "",
    indoorOutdoor: "",
    bikeType: "",
    description: "",
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  useState(() => {
    setFormData((prev) => ({ ...prev, date: getCurrentDateTime() }));
  }, []);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    if (typeof index === "number") {
      let newTestings = [...formData.testings];
      newTestings[index][name] = value;
      setFormData((prev) => ({ ...prev, testings: newTestings }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTesting = () => {
    let newTesting = {
      power: "",
      heartRate: "",
      minutes: "",
      seconds: "",
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

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
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
          {formData.testings.map((testing, index) => (
            <Grid container spacing={2} key={index}>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Indoor/Outdoor</InputLabel>
            <Select
              name="indoorOutdoor"
              value={formData.indoorOutdoor}
              label="Indoor/Outdoor"
              onChange={handleChange}
            >
              <MenuItem value="indoor">Indoor</MenuItem>
              <MenuItem value="outdoor">Outdoor</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Bike Type"
            name="bikeType"
            value={formData.bikeType}
            onChange={handleChange}
            margin="normal"
          />
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

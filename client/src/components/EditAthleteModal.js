import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, Typography } from '@mui/material';
const defaultAthlete = {
    name: '',
    age: '',
    weight: '',
    personalBests: [],
    injuries: [],
    bikeZones: {
      lt1: ['', ''],
      l3: ['', ''],
      lt2: ['', ''],
      vo2: ['', '']
    },
    runZones: {
      lt1: ['', ''],
      l3: ['', ''],
      lt2: ['', ''],
      vo2: ['', '']
    }
  };
const EditAthleteModal = ({ athlete, open, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...defaultAthlete });
  useEffect(() => {
    if (athlete) {
      setFormData(athlete);
    } else {
      setFormData({ ...defaultAthlete });
    }
  }, [athlete]);
  
  const handleChange = (e) => {
    if (e.target.name.includes('.')) {
      const [key, subkey] = e.target.name.split('.');
      setFormData({
        ...formData,
        [key]: {
          ...formData[key],
          [subkey]: e.target.value.split(',').map(v => v.trim())
        }
      });
    } else if (e.target.name === "personalBests" || e.target.name === "injuries") {
      setFormData({ ...formData, [e.target.name]: e.target.value.split(',').map(item => item.trim()) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.age || !formData.weight) {
      alert('Please fill out all fields.');
      return;
    }
    onSave(formData);
    onClose();
  };
  const dialogTitle = athlete ? "Edit Athlete Profile" : "Add New Athlete";


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Personal Bests (comma separated)"
              name="personalBests"
              multiline
              value={formData.personalBests.join(', ')}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Injuries (comma separated)"
              name="injuries"
              multiline
              value={formData.injuries.join(', ')}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Bike Zones (W)</Typography>
            {Object.keys(formData.bikeZones).map(zone => (
              <TextField
                key={zone}
                fullWidth
                label={zone.toUpperCase()}
                name={`bikeZones.${zone}`}
                value={formData.bikeZones[zone].join(', ')}
                onChange={handleChange}
                margin="normal"
              />
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Run Zones (min/km)</Typography>
            {Object.keys(formData.runZones).map(zone => (
              <TextField
                key={zone}
                fullWidth
                label={zone.toUpperCase()}
                name={`runZones.${zone}`}
                value={formData.runZones[zone].join(', ')}
                onChange={handleChange}
                margin="normal"
              />
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAthleteModal;

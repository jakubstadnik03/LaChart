import React, { useState, useEffect } from 'react';
import { addNewAthlete, editAthlete } from "../apiService";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, Typography } from '@mui/material';

const defaultAthlete = {
    name: '',
    age: '',
    weight: '',
    sport: '',
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

        setFormData(prev => ({
            ...defaultAthlete,
            ...athlete,
            bikeZones: { ...defaultAthlete.bikeZones, ...athlete?.bikeZones },
            runZones: { ...defaultAthlete.runZones, ...athlete?.runZones }
        }));
    }, [athlete]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [key, subkey] = name.split('.');
            setFormData({
                ...formData,
                [key]: {
                    ...formData[key],
                    [subkey]: value.split(',').map(v => v.trim())
                }
            });
        } else if (e.target.name === "personalBests" || e.target.name === "injuries") {
            setFormData({ ...formData, [e.target.name]: value.split(',').map(item => item.trim()) });
        } else {
            setFormData({ ...formData, [e.target.name]: value });
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.age || !formData.weight) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            if (formData._id) {
                // Edit existing athlete
                await editAthlete(formData._id, formData);
                alert('Athlete updated successfully!');
            } else {
                // Add new athlete
                await addNewAthlete(formData);
                alert('Athlete added successfully!');
            }
            onSave(formData); // You might need to adjust how you update the parent state here
            onClose();
        } catch (error) {
            console.error('Error saving athlete:', error);
            alert(`Failed to save athlete: ${error.message || 'Unknown error'}`);
        }
    };

    const dialogTitle = athlete ? "Edit Athlete Profile" : "Add New Athlete";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent style={{ paddingTop: '10px' }}>
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
                    <Grid item xs={6} sm={3}>
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
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Sport "
                            name="sport"
                            
                            value={formData.sport}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Bike Zones (W)</Typography>
                        {Object.entries(athlete.bikeZones)
                      .filter(([key]) => key !== "_id")
                      .map(([zone, values]) => (
                            <TextField
                                key={zone}
                                fullWidth
                                label={zone.toUpperCase()}
                                name={`bikeZones.${zone}`}
                                value={Array.isArray(formData.bikeZones[zone]) ? formData.bikeZones[zone].join(', ') : ''}
                                onChange={handleChange}
                                margin="normal"
                            />
                        ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Run Zones (min/km)</Typography>
                        {Object.entries(athlete.runZones)
                      .filter(([key]) => key !== "_id")
                      .map(([zone, values]) => (
                            <TextField
                                key={zone}
                                fullWidth
                                label={zone.toUpperCase()}
                                name={`runZones.${zone}`}
                                value={Array.isArray(formData.runZones[zone]) ? formData.runZones[zone].join(', ') : ''}
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

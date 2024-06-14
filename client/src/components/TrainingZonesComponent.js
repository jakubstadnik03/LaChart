// TrainingZonesComponent.js
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const TrainingZonesComponent = ({ testings }) => {
  if (!testings[0] || testings[0].points.length === 0) {
    return <Typography>No testing data available</Typography>;
  }

  const calculateZones = (points) => {
    return points.map(point => ({
      power: point.power,
      lactate: point.lactate,
      heartRate: point.heartRate,
      zone: determineZone(point.lactate)
    }));
  };

  // Zone determination logic based on lactate levels
  const determineZone = (lactate) => {
    if (lactate <= 1.5) return "Easy";
    if (lactate <= 2.0) return "Endurance";
    if (lactate <= 2.5) return "LT1";
    if (lactate <= 3.5) return "L3";
    if (lactate <= 4.5) return "LT2";
    return "VO2 Max";
  };

  const zoneData = calculateZones(testings[0].points);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Training Zones for {new Date(testings.date).toLocaleDateString()}</Typography>
      {zoneData.map((item, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Typography variant="body1">
            {`Power: ${item.power}W - Lactate: ${item.lactate} mmol/L - Heart Rate: ${item.heartRate} bpm - Zone: ${item.zone}`}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default TrainingZonesComponent;

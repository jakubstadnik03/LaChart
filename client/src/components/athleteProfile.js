import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Grid, Button, Collapse } from '@mui/material';

const AthleteProfile = ({ athlete, onEdit }) => {
  const [showInfo, setShowInfo] = useState(false);

  if (!athlete) {
    return <Typography variant="h6" sx={{ margin: 2 }}>Select an athlete to view their profile.</Typography>;
  }

  const formatZones = (zones, type) => `${zones[0]} - ${zones[1]} ${type === 'bike' ? 'W' : 'min/km'}`;

  return (
    <Card raised sx={{ minWidth: 275, m: 2, p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {athlete.name}
            </Typography>
       
            <Button onClick={() => setShowInfo(!showInfo)}>{showInfo ? 'Hide Details' : 'Show Details'}</Button>
            <Collapse in={showInfo}>
              <List dense>
                <ListItem>
                  <ListItemText primary="Age" secondary={`${athlete.age} years`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sport" secondary={`${athlete.sport}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Weight" secondary={`${athlete.weight} kg`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Personal Bests" secondary={athlete.personalBests.join(', ')} />
                </ListItem>
                {athlete.injuries && (
                  <ListItem>
                    <ListItemText primary="Injuries" secondary={athlete.injuries.join(', ')} />
                  </ListItem>
                )}
                  <Button color="primary" size="small" onClick={() => onEdit()} sx={{ ml: 2 }}>
                Edit Profile
              </Button>
              </List>
            </Collapse>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Typography variant="h6">Training Zones</Typography>
            <Collapse in={showInfo}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {athlete.bikeZones && (
                  <div>
                    <Typography variant="subtitle1">Bike Zones:</Typography>
                    {Object.entries(athlete.bikeZones).map(([zone, values]) => (
                      <Card variant="outlined" sx={{ mb: 1, p: 1, textAlign: 'center', width: '130px' }}>
                        <Typography variant="body2" color="primary">{zone.toUpperCase()}</Typography>
                        <Typography variant="caption" display="block">{formatZones(values, 'bike')}</Typography>
                      </Card>
                    ))}
                  </div>
                )}
                {athlete.runZones && (
                  <div>
                    <Typography variant="subtitle1">Run Zones:</Typography>
                    {Object.entries(athlete.runZones).map(([zone, values]) => (
                      <Card variant="outlined" sx={{ mb: 1, p: 1, textAlign: 'center', width: '130px' }}>
                        <Typography variant="body2" color="primary">{zone.toUpperCase()}</Typography>
                        <Typography variant="caption" display="block">{formatZones(values, 'run')}</Typography>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Collapse>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AthleteProfile;

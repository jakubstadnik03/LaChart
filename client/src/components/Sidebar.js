import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button } from '@mui/material';

const Sidebar = ({ athletes = [], selectedAthleteId, onSelectAthlete, onCreateNewTesting }) => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
        Logo Here
      </Typography>
      <List>
        {athletes.map((athlete) => (
          <ListItem
            button
            key={athlete.id}
            onClick={() => onSelectAthlete(athlete.id)}
            sx={{ 
              fontWeight: athlete.id === selectedAthleteId ? 'bold' : 'normal',
              color: athlete.id === selectedAthleteId ? 'blue' : 'inherit',
              display: 'flex', 
              flexDirection: 'column'
            }}
          >
            <ListItemText primary={athlete.name} />
          
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

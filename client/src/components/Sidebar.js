import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Divider } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';  // Logout icon

const Sidebar = ({ athletes, selectedAthleteId, onSelectAthlete, onSignOut, onAddNewAthlete }) => {
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
       LaChart
      </Typography>
      <Button onClick={onAddNewAthlete} sx={{ my: 1, mx: 'auto', display: 'block' }}>
        Add New Athlete
      </Button>
      <List>
        {athletes.map((athlete) => (
          <ListItem button key={athlete.id} onClick={() => onSelectAthlete(athlete.id)}
            sx={{
              fontWeight: athlete.id === selectedAthleteId ? 'bold' : 'normal',
              color: athlete.id === selectedAthleteId ? 'primary.main' : 'inherit',
            }}>
            <ListItemText primary={athlete.name} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <Button 
      onClick={onSignOut} 
      sx={{ 
        mt: 'auto', 
        mb: 2, 
        display: 'flex',  
        justifyContent: 'center',  
        alignItems: 'center',  
        width: '100%'  
      }} 
      startIcon={<ExitToAppIcon />}
    >
      Sign Out
    </Button>
    </Drawer>
  );
};

export default Sidebar;

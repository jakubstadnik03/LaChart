import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger menu icon
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout icon
import UserSettingsModal from "./UserSettingsDialogue";
const Sidebar = ({
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  onSignOut,
  onAddNewAthlete,
  user
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          ml: -2,
          mt: -2,
          display: isMobile ? "block" : "none",
          selfAlign: "baseline",
          alignSelf: "baseline",
          position: "fixed",
          fontSize: "3rem",
          pb: 0
        }}
      >
        <MenuIcon
          sx={{
            fontSize: "inherit",
            backgroundColor: "#1976d263",
            borderRadius: "100%",
            color: "white",
            p: 1,
            boxShadow: 3,
          }}
        />
      </IconButton>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isDrawerOpen : true}
        onClose={handleDrawerToggle}
        anchor="left"
      >
        <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
          LaChart
        </Typography>
        <Button onClick={() => setIsSettingsModalOpen(true)}
        sx={{
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
>
    <AccountCircleIcon sx={{ mr: 1 }} /> 
    {user?.userName}
</Button>

               <UserSettingsModal
          open={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={updatedUserData => console.log('Save user data', updatedUserData)}
          userData={user}
        />
        <Button
          onClick={onAddNewAthlete}
          sx={{ my: 0, mx: "auto", display: "block" }}
        >
          Add New Athlete
        </Button>
        <List>
          {athletes.map((athlete) => (
            <ListItem
              button
              key={athlete.name}
              onClick={() => {
                onSelectAthlete(athlete._id);
                handleDrawerToggle();
              }}
              sx={{
                fontWeight:
                  athlete._id === selectedAthleteId ? "bold" : "normal",
                color:
                  athlete._id === selectedAthleteId ? "primary.main" : "inherit",
              }}
            >
              <ListItemText primary={athlete.name} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Button
          onClick={onSignOut}
          sx={{
            mt: "auto",
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          startIcon={<ExitToAppIcon />}
        >
          Sign Out
        </Button>
      </Drawer>
    </>
  );
};

export default Sidebar;

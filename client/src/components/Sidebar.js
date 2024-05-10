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
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger menu icon
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout icon

const Sidebar = ({
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  onSignOut,
  onAddNewAthlete,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          mr: 2,
          display: isMobile ? "block" : "none",
          selfAlign: "baseline",
          alignSelf: "baseline",
          position: "fixed",
        }}
      >
        <MenuIcon />
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
        <Button
          onClick={onAddNewAthlete}
          sx={{ my: 1, mx: "auto", display: "block" }}
        >
          Add New Athlete
        </Button>
        <List>
          {athletes.map((athlete) => (
            <ListItem
              button
              key={athlete.id}
              onClick={() => {
                onSelectAthlete(athlete.id);
                handleDrawerToggle();
              }}
              sx={{
                fontWeight:
                  athlete.id === selectedAthleteId ? "bold" : "normal",
                color:
                  athlete.id === selectedAthleteId ? "primary.main" : "inherit",
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

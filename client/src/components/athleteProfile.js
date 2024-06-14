import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Button,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const AthleteProfile = ({ athlete, onEdit }) => {
  const [showInfo, setShowInfo] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!athlete) {
    return (
      <Typography variant="h6" sx={{ margin: 2 }}>
        Select an athlete to view their profile.
      </Typography>
    );
  }

  const formatZones = (zones, type) =>
    `${zones[0]} - ${zones[1]} ${type === "bike" ? "W" : "min/km"}`;

  return (
    <Card raised sx={{ minWidth: 275, m: 2, p: { xs: 0, md: 2 } }}>
      <Grid container spacing={2} sx={{ p: 0 }}>
        <Grid item xs={12} md={6} sx={{ p: 0, pb: 0 }}>
          <CardContent sx={{ p: { xs: 0, md: 0 }, pt: 0 }}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ p: { xs: 1, md: 2 }, m: 0 }}
            >
              {athlete.name}
            </Typography>

            <Button onClick={() => setShowInfo(!showInfo)}>
              {showInfo ? "Hide Details" : "Show Details"}
            </Button>
            <Collapse in={showInfo}>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Age"
                    secondary={`${athlete.age} years`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Sport"
                    secondary={`${athlete.sport}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Weight"
                    secondary={`${athlete.weight} kg`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Personal Bests"
                    secondary={athlete.personalBests.join(", ")}
                  />
                </ListItem>
                {athlete.injuries && (
                  <ListItem>
                    <ListItemText
                      primary="Injuries"
                      secondary={athlete.injuries.join(", ")}
                    />
                  </ListItem>
                )}
                <Button color="primary" size="small" onClick={onEdit}>
                  Edit Profile
                </Button>
              </List>
            </Collapse>
          </CardContent>
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: { xs: 0, md: 2 }, mt: -2 }}>
          <CardContent sx={{ p: { xs: 0, md: 2 } }}>
            <Typography variant="h6" sx={{ p: { xs: 0, md: 2 } }}>
              Training Zones
            </Typography>
            <Collapse in={showInfo}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                {athlete.bikeZones && (
                  <div>
                    <Typography variant="subtitle1">Bike Zones:</Typography>
                    {Object.entries(athlete.bikeZones)
                      .filter(([key]) => key !== "_id")
                      .map(([zone, values]) => (
                        <Card
                          key={zone}
                          variant="outlined"
                          sx={{
                            mb: 1,
                            p: 1,
                            textAlign: "center",
                            width: isMobile ? "100%" : "130px",
                          }}
                        >
                          <Typography variant="body2" color="primary">
                            {zone.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {formatZones(values, "bike")}
                          </Typography>
                        </Card>
                      ))}
                  </div>
                )}
                {athlete.runZones && (
                  <div>
                    <Typography variant="subtitle1">Run Zones:</Typography>
                    {Object.entries(athlete.runZones)
                      .filter(([key]) => key !== "_id")
                      .map(([zone, values]) => (
                        <Card
                          key={zone}
                          variant="outlined"
                          sx={{
                            mb: 1,
                            p: 1,
                            textAlign: "center",
                            width: isMobile ? "100%" : "130px",
                          }}
                        >
                          <Typography variant="body2" color="primary">
                            {zone.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {formatZones(values, "run")}
                          </Typography>
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

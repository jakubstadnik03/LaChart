// TestingAccordion.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme, useMediaQuery } from "@mui/material";

const TestingAccordion = ({ testings }) => {
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return testings.map((testing, index) => (
    <Paper elevation={3} sx={{ mb: 3, zIndex: 2, m: 1 }}>
      <Accordion key={index}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ flexShrink: 0 }}>
            {!isMobile && <span> Testing: </span>}{" "}
            {new Date(testing.date).toLocaleDateString()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card
            raised
            sx={{
              width: "100%",
              mb: 2,
              bgcolor: colors[index % colors.length],
              color: "white",
              fontWeight: "bold",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">
                Sport:{" "}
                {testing.sport.charAt(0).toUpperCase() + testing.sport.slice(1)}
              </Typography>
              <Typography variant="subtitle1">
                Weight: {testing.weight} kg
              </Typography>
              <Typography variant="subtitle1">
                Indoor/Outdoor: {testing.indoorOutdoor}
              </Typography>
              {testing.sport === "run" && (
                <Typography variant="subtitle1">
                  Type of Shoes: {testing.typeOfShoes}
                </Typography>
              )}
              {testing.sport === "bike" && (
                <Typography variant="subtitle1">
                  Type of Bike: {testing.bikeType}
                </Typography>
              )}
              {testing.sport === "swim" && (
                <Typography variant="subtitle1">
                  Pool Length: {testing.poolLength} m
                </Typography>
              )}
              <Typography variant="body1">
                Description: {testing.description}
              </Typography>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>
    </Paper>
  ));
};

export default TestingAccordion;

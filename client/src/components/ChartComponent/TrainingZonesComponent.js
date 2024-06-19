import React from "react";
import {
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TrainingZonesComponent = ({ testings, secondsToPace }) => {
  if (!testings || testings.length === 0 || !testings[0].points) {
    return <Typography sx={{ p: 2 }}>No testing data available</Typography>;
  }

  // Determine if the sport requires pace conversion
  const isPaceBasedSport = ["run", "swim"].includes(testings[0].sport);

  const calculateZones = (points) => {
    const zoneData = points.map((point) => ({
      ...point,
      zone: "Endurance", // Default zone
      // Convert power to pace if applicable
      displayPower: isPaceBasedSport ? secondsToPace(point.power) : point.power,
    }));

    // Define thresholds for lactate levels
    const thresholds = [
      { upper: 1.0, zone: "Endurance" },
      { upper: 1.5, zone: "Endurance" },
      { upper: 2.0, zone: "LT1" },
      { upper: 3.0, zone: "L3" },
      { upper: 4.0, zone: "LT2" },
      { upper: Infinity, zone: "VO2 Max" },
    ];

    // Identify zones based on lactate levels
    for (let i = 0; i < zoneData.length; i++) {
      const lactate = zoneData[i].lactate;
      for (let j = 0; j < thresholds.length; j++) {
        if (lactate <= thresholds[j].upper) {
          zoneData[i].zone = thresholds[j].zone;
          break;
        }
      }
    }

    return zoneData;
  };

  const zoneData = calculateZones(testings[0].points);

  return (
    <Paper elevation={3} sx={{ mb: 3, zIndex: 2, m: 1 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ flexShrink: 0 }}>
            Training Zones for {new Date(testings[0].date).toLocaleDateString()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table sx={{ minWidth: 300 }} aria-label="training zones table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {isPaceBasedSport ? "Pace" : "Power (W)"}
                  </TableCell>
                  <TableCell align="right">Lactate (mmol/L)</TableCell>
                  <TableCell align="right">Heart Rate (bpm)</TableCell>
                  <TableCell align="right">Zone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zoneData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.displayPower}
                    </TableCell>
                    <TableCell align="right">{item.lactate}</TableCell>
                    <TableCell align="right">{item.heartRate}</TableCell>
                    <TableCell align="right">{item.zone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default TrainingZonesComponent;

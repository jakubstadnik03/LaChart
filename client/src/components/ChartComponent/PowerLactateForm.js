import React, { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  TextField,
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const PowerLactateForm = ({ onSaveNewTesting, athleteId }) => {
  const [inputFields, setInputFields] = useState([
    { power: "", lactate: "", heartRate: "" },
  ]);
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  const [sport, setSport] = useState("");
  const [description, setDescription] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [bikeType, setBikeType] = useState("");
  const [shoeType, setShoeType] = useState("");
  const [poolLength, setPoolLength] = useState("");
  const [weight, setWeight] = useState(""); // Added weight state

  const handleInputChange = (index, type, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index][type] = value;
    setInputFields(newInputFields);
  };

  const handleSaveNewTesting = () => {
    const newTesting = {
      athleteId: athleteId, // This should be dynamically set based on your app's context
      date: new Date().toISOString(),
      sport,
      description,
      indoorOutdoor,
      bikeType,
      shoeType,
      poolLength,
      weight,
      points: chartData
        .filter((field) => field.power && field.lactate && field.heartRate)
        .map((field) => ({
          power: field.power,
          lactate: field.lactate,
          heartRate: field.heartRate,
        })),
    };
    onSaveNewTesting(newTesting);
    console.log(newTesting);
  };
  const addInputField = () => {
    setInputFields([...inputFields, { power: "", lactate: "", heartRate: "" }]);
  };

  const removeInputField = (index) => {
    if (inputFields.length > 1) {
      const newInputFields = [...inputFields];
      newInputFields.splice(index, 1);
      setInputFields(newInputFields);
    }
  };

  const paceToSeconds = (pace) => {
    const [minutes, seconds] = pace.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  // Utility function to convert seconds back to mm:ss format
  const secondsToPace = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  let minPaceInSeconds = Infinity;
  let maxPaceInSeconds = -Infinity;

  const chartData = inputFields.map((field, index) => {
    let powerValue;
    if (sport === "run" || sport === "swim") {
      powerValue = paceToSeconds(field.power);
      minPaceInSeconds = Math.min(minPaceInSeconds, powerValue);
      maxPaceInSeconds = Math.max(maxPaceInSeconds, powerValue);
    } else {
      powerValue = parseFloat(field.power);
    }

    return {
      index: index + 1,
      power: powerValue,
      lactate: parseFloat(field.lactate) || 0,
      heartRate: parseInt(field.heartRate, 10) || 0,
    };
  });

  if (sport === "run") {
    chartData.sort((a, b) => a.power - b.power);
  }

  const paceDomain =
    sport === "run" || sport === "swim"
      ? [maxPaceInSeconds, minPaceInSeconds]
      : ["auto", "auto"];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Power, Lactate & Heart Rate Chart
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 3 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="power"
              name={sport === "run" || sport === "swim" ? "Pace" : "Power"}
              unit={sport === "run" || sport === "swim" ? "/km" : "W"}
              domain={paceDomain} // Apply the calculated domain here
              allowDataOverflow
              tickFormatter={(tick) =>
                sport === "run" || sport === "swim"
                  ? secondsToPace(tick)
                  : tick.toString()
              }
            />
            <YAxis
              type="number"
              dataKey="lactate"
              name="Lactate"
              unit="mmol/L"
            />
            <Tooltip
              content={
                <CustomTooltip
                  secondsToPace={secondsToPace}
                  colors={colors}
                  testings={chartData}
                  newTesting={true}
                  sportSet={sport}
                />
              }
            />
            <Legend />
            <Scatter name="Entries" data={chartData} fill="#8884d8">
              {chartData.map((entry, index) => (
                <circle
                  key={`circle-${index}`}
                  cx={entry.power}
                  cy={entry.lactate}
                  r={4}
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              ))}
            </Scatter>
            <Line
              type="linear"
              dataKey="lactate"
              stroke="#8884d8"
              dot={{ stroke: "#8884d8", strokeWidth: 2, fill: "#8884d8" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div>
          <Box component="form" noValidate autoComplete="off" sx={{ mb: 2 }}>
            {inputFields.map((input, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <TextField
                  label={
                    sport === "swim"
                      ? `Pace ${index + 1} (mm:ss/100m)`
                      : sport === "run"
                      ? `Pace ${index + 1} (mm:ss/km)`
                      : `Power ${index + 1}`
                  }
                  variant="outlined"
                  value={input.power}
                  onChange={(e) =>
                    handleInputChange(index, "power", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label={`Lactate ${index + 1}`}
                  variant="outlined"
                  value={input.lactate}
                  onChange={(e) =>
                    handleInputChange(index, "lactate", e.target.value)
                  }
                  type="number"
                />
                <TextField
                  label={`Heart Rate ${index + 1}`}
                  variant="outlined"
                  value={input.heartRate}
                  onChange={(e) =>
                    handleInputChange(index, "heartRate", e.target.value)
                  }
                  type="number"
                />
                <IconButton
                  onClick={() => removeInputField(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconButton onClick={addInputField} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>

              <FormControl sx={{ width: "100px", textAlign: "left" }}>
                <InputLabel id="sport-select-label">Sport</InputLabel>
                <Select
                  labelId="sport-select-label"
                  id="sport-select"
                  value={sport}
                  label="Sport"
                  onChange={(e) => setSport(e.target.value)}
                >
                  <MenuItem value="run">Run</MenuItem>
                  <MenuItem value="bike">Bike</MenuItem>
                  <MenuItem value="swim">Swim</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 6 }}
                onClick={handleSaveNewTesting}
              >
                Save Testing
              </Button>
            </Box>
          </Box>
        </div>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
        <TextField
          label="Weight (kg)"
          variant="outlined"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          type="number"
          fullWidth
          sx={{ mb: 2 }}
        />
        {sport === "bike" && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="indoor-outdoor-select-label">
                Indoor/Outdoor
              </InputLabel>
              <Select
                labelId="indoor-outdoor-select-label"
                id="indoor-outdoor-select"
                value={indoorOutdoor}
                label="Indoor/Outdoor"
                onChange={(e) => setIndoorOutdoor(e.target.value)}
              >
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Type of Bike"
              variant="outlined"
              fullWidth
              value={bikeType}
              onChange={(e) => setBikeType(e.target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}
        {sport === "run" && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="run-indoor-outdoor-select-label">
                Indoor/Outdoor
              </InputLabel>
              <Select
                labelId="run-indoor-outdoor-select-label"
                id="run-indoor-outdoor-select"
                value={indoorOutdoor}
                label="Indoor/Outdoor"
                onChange={(e) => setIndoorOutdoor(e.target.value)}
              >
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Type of Shoes"
              variant="outlined"
              fullWidth
              value={shoeType}
              onChange={(e) => setShoeType(e.target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}
        {sport === "swim" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="pool-length-select-label">Pool Length</InputLabel>
            <Select
              labelId="pool-length-select-label"
              id="pool-length-select"
              value={poolLength}
              label="Pool Length"
              onChange={(e) => setPoolLength(e.target.value)}
            >
              <MenuItem value="25">25m</MenuItem>
              <MenuItem value="50">50m</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Paper>
  );
};

export default PowerLactateForm;

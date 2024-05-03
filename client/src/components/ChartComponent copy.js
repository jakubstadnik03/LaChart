import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const ChartComponent = ({ testings }) => {
  const [chartData, setChartData] = useState([]);
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [showHeartRate, setShowHeartRate] = useState(true);

  const [sortedPowers, setSortedPowers] = useState([]);
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [zoomDomain, setZoomDomain] = useState({
    left: "dataMax",
    right: "dataMin",
  });

  useEffect(() => {
    const powerSet = new Set();

    testings.forEach((testing) => {
      testing.points.forEach((point) => {
        powerSet.add(Number(point.power));
      });
    });

    let powers = Array.from(powerSet).sort((a, b) => a - b);
    console.log("Sorted powers (initial):", powers);

    if (testings.length && testings[0].sport === "run") {
      powers.reverse();
      console.log("Reversed powers for running:", powers);
    }

    setSortedPowers(powers);

    const combinedData = powers.map((power) => {
      const dataPoint = { power };
      testings.forEach((testing, index) => {
        const point = testing.points.find((pt) => Number(pt.power) === power);
        dataPoint[`lactate${index + 1}`] = point ? point.lactate : null;
        dataPoint[`heartRate${index + 1}`] = point ? point.heartRate : null;
      });
      return dataPoint;
    });

    console.log("ChartData:", combinedData);
    setChartData(combinedData);
  }, [testings]);

  const secondsToPace = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };
  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    // Set new zoom domain
    setZoomDomain({
      left: Math.min(refAreaLeft, refAreaRight),
      right: Math.max(refAreaLeft, refAreaRight),
    });

    setRefAreaLeft("");
    setRefAreaRight("");
  };
  const resetZoom = () => {
    setZoomDomain({ left: "dataMax", right: "dataMin" });
  };
  const handleAddPoint = () => {
    if (renderEditUI) {
      setChartData(
        chartData.concat([{ power: "", lactate: "", heartRate: "" }])
      );
    }
  };
  const handleResetChanges = () => {
    if (renderEditUI) {
      setChartData(originalData);
    }
  };

  const handleToggleHeartRate = (event) => {
    setShowHeartRate(event.target.checked);
  };
  const handleValueChange = (index, field, value) => {
    if (renderEditUI) {
      const newData = [...chartData];
      newData[index][field] = Number(value) || "";
      setData(newData);
    }
  };
  const renderTestingInfo = () => {
    return testings.map((testing, index) => (
      <Card key={index} raised sx={{ maxWidth: 345, mb: 2, mt: 2, mr: 2 }}>
        <CardContent sx={{ color: colors[index % colors.length] }}>
          {" "}
          {/* Apply the color dynamically */}
          <Typography variant="h6" gutterBottom>
            Testing Date: {new Date(testing.date).toLocaleDateString()}
          </Typography>
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
    ));
  };

  const removeInputField = (index) => {
    if (renderEditUI) {
      const newInputFields = [...chartData];
      newInputFields.splice(index, 1);
      setChartData(newInputFields);
    }
  };
  const renderEditUI = testings.length === 1;

  const handleSaveChanges = () => {
    if (renderEditUI) {
      setOriginalData([...chartData]);
      // Integrate save logic here, such as updating the backend
    }
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const sport = testings[0]?.sport; // Assuming 'testings' array is available in this scope
      const displayPace = sport === "run"; // Check if the sport is running to decide on displaying pace

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          <p>
            {displayPace
              ? `Pace: ${secondsToPace(payload[0].payload.power)}`
              : `Power: ${payload[0].payload.power} W`}
          </p>
          {payload.map((entry, index) => {
            // Generate the content dynamically for each dataset
            return (
              <>
                {entry.payload[`lactate${index + 1}`] !== undefined && (
                  <p style={{ color: colors[index] }}>
                    Lactate{index + 1}: {entry.payload[`lactate${index + 1}`]}{" "}
                    mmol/L
                  </p>
                )}
                {entry.payload[`heartRate${index + 1}`] !== undefined && (
                  <p style={{ color: colors[index] }}>
                    Heart Rate{index + 1}:{" "}
                    {entry.payload[`heartRate${index + 1}`]} bpm
                  </p>
                )}
              </>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", p: 3 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={500}
            height={300}
            data={chartData}
            onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
            onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
            onMouseUp={zoom}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="power"
              name={testings[0]?.sport === "run" ? "Pace" : "Power"}
              unit={testings[0]?.sport === "run" ? "/km" : "W"}
              domain={[zoomDomain.left, zoomDomain.right]}
              tickFormatter={(tick) =>
                testings[0]?.sport === "run"
                  ? secondsToPace(tick)
                  : tick.toString()
              }
              allowDataOverflow
              ticks={sortedPowers}
            />

            <YAxis
              unit="Bpm"
              yAxisId="right"
              orientation="right"
              domain={[60, "auto"]}
            />
            <YAxis unit="mmol/L" yAxisId="left" orientation="left" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {testings.map((testing, index) => {
              const dateOnly = testing.date.split(" ")[0];
              return (
                <Line
                  key={index}
                  yAxisId="left"
                  type="linear"
                  dataKey={`lactate${index + 1}`}
                  name={`Lactate on ${dateOnly}`}
                  stroke={colors[index % colors.length]}
                  dot={true}
                  connectNulls
                  isAnimationActive={false}
                />
              );
            })}
            {testings.length === 1 && showHeartRate && (
              <Line
                yAxisId="right"
                type="linear"
                dataKey="heartRate1"
                stroke="#82ca9d"
                dot={true}
                isAnimationActive={false}
              />
            )}

            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                yAxisId="1"
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="red"
              />
            )}
          </LineChart>
          {testings.length < 2 && (
            <FormControlLabel
              control={
                <Switch
                  checked={showHeartRate}
                  onChange={handleToggleHeartRate}
                />
              }
              label="Show Heart Rate"
            />
          )}
          <Button onClick={resetZoom} variant="contained" color="primary">
            Reset Zoom
          </Button>
        </ResponsiveContainer>

        {renderEditUI && (
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 1,
                mt: -5,
              }}
            >
              <IconButton onClick={handleAddPoint} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={handleResetChanges} color="secondary">
                <RestartAltIcon />
              </IconButton>
            </Box>
            <div>
              {chartData.map((point, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <TextField
                    label={`Power ${index + 1}`}
                    variant="outlined"
                    type="number"
                    value={point.power}
                    onChange={(e) =>
                      handleValueChange(index, "power", e.target.value)
                    }
                  />
                  <TextField
                    label={`Lactate ${index + 1}`}
                    variant="outlined"
                    type="number"
                    value={point.lactate1}
                    onChange={(e) =>
                      handleValueChange(index, "lactate", e.target.value)
                    }
                  />
                  <TextField
                    label={`Heart Rate ${index + 1}`}
                    variant="outlined"
                    type="number"
                    value={point.heartRate1}
                    onChange={(e) =>
                      handleValueChange(index, "heartRate", e.target.value)
                    }
                  />
                  <IconButton
                    onClick={() => removeInputField(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              sx={{ alignSelf: "flex-end", mt: 2 }}
            >
              Save Changes
            </Button>
          </div>
        )}
      </Box>
      <div style={{ display: "flex" }}>
        {testings.length > 0 && renderTestingInfo()}
      </div>
    </>
  );
};

export default ChartComponent;

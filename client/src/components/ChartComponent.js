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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTheme, useMediaQuery } from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const powerSet = new Set();
    testings.forEach((testing) => {
      testing.points.forEach((point) => {
        powerSet.add(Number(point.power));
      });
    });
    let powers = Array.from(powerSet).sort((a, b) => a - b);
    if (testings.length && testings[0].sport === "run") {
      powers.reverse();
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
    setChartData(combinedData);
    setZoomDomain({ left: powers[0], right: powers[powers.length - 1] });
  }, [testings]);

  const secondsToPace = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const zoom = () => {
    if (!refAreaLeft || !refAreaRight || refAreaLeft === refAreaRight) {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }
    const start = Math.min(refAreaLeft, refAreaRight);
    const end = Math.max(refAreaLeft, refAreaRight);
    setZoomDomain({
      left: testings[0]?.sport === "run" ? end : start,
      right: testings[0]?.sport === "run" ? start : end,
    });
    setRefAreaLeft("");
    setRefAreaRight("");
  };

  const resetZoom = () => {
    setZoomDomain({
      left: sortedPowers[0],
      right: sortedPowers[sortedPowers.length - 1],
    });
  };

  const handleAddPoint = () => {
    setChartData(chartData.concat([{ power: "", lactate: "", heartRate: "" }]));
  };

  const handleResetChanges = () => {
    setChartData(originalData);
  };

  const handleToggleHeartRate = (event) => {
    setShowHeartRate(event.target.checked);
  };

  const handleValueChange = (index, field, value) => {
    const newData = [...chartData];
    newData[index][field] = Number(value) || "";
    setData(newData);
  };

  const renderTestingInfo = () => {
    return testings.map((testing, index) => (
      <Accordion
        key={index}
        style={{ marginTop: "-60px", marginBottom: "30px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{  flexShrink: 0 }}>
            Testing: {new Date(testing.date).toLocaleDateString()}
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
    ));
  };

  const removeInputField = (index) => {
    const newInputFields = [...chartData];
    newInputFields.splice(index, 1);
    setChartData(newInputFields);
  };

  const renderEditUI = testings.length === 1;

  const handleSaveChanges = () => {
    setOriginalData([...chartData]);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const sport = testings[0]?.sport;
      const displayPace = sport === "run";
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
          {payload.map((entry, index) => (
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
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          p: { xs: 0, md: 3 },
        }}
      >
        <ResponsiveContainer
          width="100%"
          height={isMobile ? 300 : 400}
          sx={{ mb: 2, p: 0 }}
        >
          <LineChart
            data={chartData}
            onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
            onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
            onMouseUp={zoom}
            margin={
              isMobile
                ? { top: 0, right: 0, left: 0, bottom: 5 }
                : { top: 5, right: 30, left: 20, bottom: 5 }
            }
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
              tick={isMobile ? false : true}
            />
            <YAxis
              unit="mmol/L"
              yAxisId="left"
              orientation="left"
              tick={isMobile ? false : true}
            />
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
                  activeDot={{ r: 6 }}
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
                activeDot={{ r: 6 }}
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
                mt: isLargeScreen ? -5 : 5,
              }}
            >
              <IconButton onClick={handleAddPoint} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={handleResetChanges} color="secondary">
                <RestartAltIcon />
              </IconButton>
            </Box>
            <div style={{ marginTop: isLargeScreen ? "0px" : "0px" }}>
              {chartData.map((point, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <TextField
                      label={
                        testings[0].sport === "run"
                          ? `Pace ${index + 1}`
                          : `Power ${index + 1}`
                      }
                      variant="outlined"
                      value={
                        testings[0].sport === "run"
                          ? secondsToPace(point.power)
                          : point.power
                      }
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
                );
              })}
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
      <div
        style={{
          display: "flex",
          marginTop: testings.length > 1 ? "90px" : "0",
        }}
      >
        {testings.length > 0 && renderTestingInfo()}
      </div>
    </>
  );
};

export default ChartComponent;

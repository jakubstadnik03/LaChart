// ChartComponent.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from "recharts";
import { Box, Button, Switch, FormControlLabel } from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import TestingAccordion from "./TestingAccordion";
import { useTheme, useMediaQuery } from "@mui/material";
import ChartTestingData from "./ChartTestingData";
import TrainingZonesComponent from "./TrainingZonesComponent";

const ChartComponent = ({ testings }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];
  const [chartData, setChartData] = useState([]);
  const [showHeartRate, setShowHeartRate] = useState(true);

  const [sortedPowers, setSortedPowers] = useState([]);
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
    if (
      (testings.length && testings[0].sport === "run") ||
      (testings.length && testings[0].sport === "swim")
    ) {
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

  const zoom = () => {
    if (!refAreaLeft || !refAreaRight || refAreaLeft === refAreaRight) {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }
    const start = Math.min(refAreaLeft, refAreaRight);
    const end = Math.max(refAreaLeft, refAreaRight);
    setZoomDomain({
      left:
        testings[0]?.sport === "run"
          ? end
          : testings[0]?.sport === "swim"
          ? end
          : start,
      right:
        testings[0]?.sport === "run"
          ? start
          : testings[0]?.sport === "swim"
          ? start
          : end,
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
  const secondsToPace = (seconds) => {
    if (testings[0]?.sport === "swim") {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };
  const paceToSeconds = (pace) => {
    const [mins, secs] = pace.split(":").map(Number);
    return mins * 60 + secs;
  };
  const handleToggleHeartRate = (event) => {
    setShowHeartRate(event.target.checked);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "row" },
        p: { xs: 0, md: 3 },
        maxWidth: "1620",
        minHeight: "500px",
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
              : { top: 25, right: 30, left: 20, bottom: 5 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="power"
            name={testings[0]?.sport === "run" ? "Pace" : "Power"}
            unit={
              testings[0]?.sport === "run"
                ? "/km"
                : testings[0]?.sport === "bike"
                ? "W"
                : "/100m"
            }
            domain={[zoomDomain.left, zoomDomain.right]}
            tickFormatter={(tick) =>
              testings[0]?.sport === "run"
                ? secondsToPace(tick)
                : testings[0]?.sport === "swim"
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
          <Tooltip
            content={
              <CustomTooltip
                colors={colors}
                testings={testings}
                secondsToPace={secondsToPace}
              />
            }
          />
          <Legend />
          {testings.map((testing, index) => {
            const dateOnly = new Date(testing.date).toLocaleDateString();
            return (
              <Line
                key={testing._id}
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

        <span
          style={{
            display: "flex",
            marginTop: testings.length > 1 ? "90px" : "30px",
            zIndex: 999,
            alignItems: "flex-start",
          }}
        >
          <TrainingZonesComponent
            testings={testings}
            secondsToPace={secondsToPace}
          />
          <TestingAccordion testings={testings} />
        </span>
      </ResponsiveContainer>
      {testings && testings.length === 1 && (
        <ChartTestingData
          testings={chartData}
          secondsToPace={secondsToPace}
          paceToSeconds={paceToSeconds}
          testing={testings}
        />
      )}
    </Box>
  );
};

export default ChartComponent;

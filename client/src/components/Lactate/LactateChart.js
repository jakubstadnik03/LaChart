import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Paper, Typography, Button, Box } from "@mui/material";

const LactateChart = ({ datas, selectedAthleteId }) => {
  const data = datas
    .filter((measurement) => measurement.athleteId === selectedAthleteId)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date from oldest to newest

  const flattenMeasurements = (data) => {
    return data.reduce((acc, test) => {
      const { date, testings, sport } = test;
      const formattedMeasurements = testings.map((measurement) => ({
        ...measurement,
        date,
        sport,
      }));
      return acc.concat(formattedMeasurements);
    }, []);
  };

  const [filter, setFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("bike");
  const [flattenedData, setFlattenedData] = useState([]);
  const dateFormatter = (tick) => new Date(tick).toLocaleDateString();

  useEffect(() => {
    setFlattenedData(flattenMeasurements(data));
  }, [datas, selectedAthleteId]);

  const filteredData = flattenedData.filter((item) => {
    switch (filter) {
      case "low":
        return item.lactate <= 2;
      case "medium":
        return item.lactate > 2 && item.lactate <= 4;
      case "high":
        return item.lactate > 4;
      default:
        return item.sport === sportFilter;
    }
  });

  const formatIntervalLength = (minutes, seconds) => {
    if (seconds) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:00`;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">{`Date: ${new Date(
            data.date
          ).toLocaleDateString()}`}</Typography>
          <Typography variant="body1">{`Power: ${data.power} W`}</Typography>
          <Typography variant="body1">{`Heart Rate: ${data.heartRate} bpm`}</Typography>
          <Typography variant="body1">{`Lactate: ${data.lactate} mmol/L`}</Typography>
          {data.minutes !== "" && (
            <Typography variant="body1">{`Interval Length: ${formatIntervalLength(
              data.minutes,
              data.seconds
            )}`}</Typography>
          )}
          {data.minutes == "" && (
            <Typography variant="body1">{`Interval Length: ${data.distance} km `}</Typography>
          )}

          <Typography variant="body1">{`Effort: ${data.effort}`}</Typography>
        </Paper>
      );
    }

    return null;
  };

  const renderXAxis = () => {
    if (sportFilter === "bike") {
      return <XAxis dataKey="power" name="Power" unit="W" />;
    }
    return <XAxis dataKey="pace" name="Pace" />;
  };

  const calculatePace = (power) => {
    const minutes = Math.floor(power / 60);
    const seconds = power % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const enhancedData = filteredData.map((item) => ({
    ...item,
    pace: calculatePace(item.power),
  }));

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => setFilter("all")}>All</Button>
        <Button onClick={() => setFilter("low")}>Lactate ≤ 2</Button>
        <Button onClick={() => setFilter("medium")}>Lactate 2-4</Button>
        <Button onClick={() => setFilter("high")}>Lactate {">"} 4</Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => setSportFilter("bike")}>Bike</Button>
        <Button onClick={() => setSportFilter("run")}>Run</Button>
        <Button onClick={() => setSportFilter("swim")}>Swim</Button>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={enhancedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {renderXAxis()}
          <YAxis unit="mmol" yAxisId="left" orientation="left" />
          <YAxis
            unit="bpm"
            yAxisId="right"
            orientation="right"
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="linear"
            dataKey="lactate"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            connectNulls
            yAxisId="left"
          />
          <Line
            type="linear"
            yAxisId="right"
            dataKey="heartRate"
            stroke="#ffc658"
          />
          <Brush
            dataKey="date"
            height={30}
            stroke="#8884d8"
            travellerWidth={10}
            startIndex={0}
            endIndex={enhancedData.length - 1}
            tickFormatter={dateFormatter}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LactateChart;

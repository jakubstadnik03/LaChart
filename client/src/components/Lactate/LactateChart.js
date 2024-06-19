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
} from "recharts";
import { Paper, Typography } from "@mui/material";

import { Button, Box } from "@mui/material";
const LactateChart = ({ datas, selectedAthleteId }) => {
  const data = datas.filter(
    (measurement) => measurement.athleteId === selectedAthleteId
  );
  const flattenMeasurements = (data) => {
    return data.reduce((acc, test) => {
      const { date, testings } = test;
      const formattedMeasurements = testings.map((measurement) => ({
        ...measurement,
        date,
      }));
      return acc.concat(formattedMeasurements);
    }, []);
  };

  const [filter, setFilter] = useState("all");
  const [flattenedData, setFlattenedData] = useState([]);

  useEffect(() => {
    setFlattenedData(flattenMeasurements(data));
  }, [datas]);

  const filteredData = flattenedData.filter((item) => {
    switch (filter) {
      case "low":
        return item.lactate <= 2;
      case "medium":
        return item.lactate > 2 && item.lactate <= 4;
      case "high":
        return item.lactate > 4;
      default:
        return true;
    }
  });
  const CustomTooltip = ({ active, payload, label }) => {
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

          <Typography variant="body1">{`Interval Length: ${data.intervalLength}`}</Typography>
          <Typography variant="body1">{`Effort: ${data.effort}`}</Typography>
        </Paper>
      );
    }

    return null;
  };

  return (
    <Box>
      <Box>
        <Button onClick={() => setFilter("all")}>All</Button>
        <Button onClick={() => setFilter("low")}>Lactate ≤ 2</Button>
        <Button onClick={() => setFilter("medium")}>Lactate 2-4</Button>
        <Button onClick={() => setFilter("high")}>Lactate {">"} 4</Button>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={filteredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="power" name="Power" unit="W" />

          <YAxis unit="mmol" yAxisId="left" />
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
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LactateChart;

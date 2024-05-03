import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Box from '@mui/material/Box';

const BarChartComponent = ({ testings }) => {
  const [chartData, setChartData] = useState([]);
  const colors = ['#8884d8', '#82ca9d', '#ffc658']; // Different colors for different bars

  useEffect(() => {
    let stepCounter = 1; // Initialize a step counter
    const combinedData = testings.flatMap(testing => 
      testing.points.map(point => {
        const dataPoint = {
          ...point,
          wattsPerKg: (Number(point.power) / testing.weight).toFixed(2),
          power: Number(point.power),
          name: `Step ${stepCounter++}` // Increment step counter for each point
        };
        return dataPoint;
      })
    );

    setChartData(combinedData);
  }, [testings]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const entry = payload[0];
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p style={{ color: entry.color }}>Power: {entry.payload.power} W</p>
          <p style={{ color: entry.color }}>Watts/Kg: {entry.payload.wattsPerKg}</p>
          <p style={{ color: entry.color }}>Lactate: {entry.payload.lactate} mmol/L</p>
          <p style={{ color: entry.color }}>Heart Rate: {entry.payload.heartRate} Bpm</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" unit="W/Kg"/>
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" unit="mmol/L" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="wattsPerKg" fill="#8884d8" name="Watts per Kg" />
          <Bar yAxisId="right" dataKey="lactate" fill="#82ca9d" name="Lactate" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartComponent;

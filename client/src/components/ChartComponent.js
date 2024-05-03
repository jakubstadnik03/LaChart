import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { TextField, Button, Switch, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For adding new points
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // For resetting changes
import Typography from '@mui/material/Typography';


const ChartComponent = ({ testings }) => {
  const [chartData, setChartData] = useState([]);
  const colors = ['#8884d8', '#82ca9d', '#ffc658']; // Different colors for different lines
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [showHeartRate, setShowHeartRate] = useState(true);
  const [lt1, setLt1] = useState(null);
  const [lt2, setLt2] = useState(null);

  

  useEffect(() => {
    // Assuming that 'testings' is an array of testing objects
    const powerSet = new Set();

    // Collect all unique power values from all testings
    testings.forEach(testing => {
      testing.points.forEach(point => {
        powerSet.add(Number(point.power));
      });
    });

    // Sort powers numerically
    const sortedPowers = Array.from(powerSet).sort((a, b) => a - b);
    if(testings.length > 1) {
      setShowHeartRate(false);
    }
    // Create a new chart data array that contains all powers with lactate and heartRate
    const combinedData = sortedPowers.map(power => {
      setOriginalData(sortedPowers)
      const dataPoint = { power };
      testings.forEach((testing, index) => {
        // Find the point for the current power in this testing
        const point = testing.points.find(pt => Number(pt.power) === power);
        // Use the point's data if available, otherwise fill in with null or suitable default
        dataPoint[`lactate${index + 1}`] = point ? point.lactate : null;
        dataPoint[`heartRate${index + 1}`] = point ? point.heartRate : null;
      });
      return dataPoint;
    });

    setChartData(combinedData);
  }, [testings]);


  
  const secondsToPace = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };



  const handleAddPoint = () => {
    if (renderEditUI) {
      setChartData(chartData.concat([{ power: '', lactate: '', heartRate: '' }]));
    }
  };
  const handleResetChanges = () => {
    if (renderEditUI) {
      setChartData(originalData);
    }
  };  const isEditingEnabled = testings.length === 1;

  const handleToggleHeartRate = (event) => {
    setShowHeartRate(event.target.checked);
  };
  const handleValueChange = (index, field, value) => {
    if (renderEditUI) {
      const newData = [...chartData];
      newData[index][field] = Number(value) || '';
      setData(newData);
    }
  };
  const renderTestingInfo = (testing) => {
    return (
      <Box sx={{textAlign: "left"}}>
        <Typography variant="h6">Testing Info:</Typography>
        <Typography>Weight: {testing.weight}kg</Typography>
        <Typography>Indoor/Outdoor: {testing.indoorOutdoor}</Typography>
        {testing.sport === 'run' && <Typography>Type of Shoes: {testing.typeOfShoes}</Typography>}
        {testing.sport === 'bike' && <Typography>Type of Bike: {testing.bikeType}</Typography>}
        {testing.sport === 'swim' && <Typography>Pool Length: {testing.poolLength}m</Typography>}
        <Typography variant="body1" sx={{maxWidth: "400px"}}>Description: {testing.description}</Typography>
      </Box>
    );
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
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p>Power: {payload[0].payload.power} W</p>
          {payload.map((entry, index) => {
            console.log(index);
            const lactateKey = entry.payload[`lactate${index + 1}`] ? `lactate${index + 1}` : "lactate2";
            const heartRateKey = entry.payload[`heartRate${index + 1}`] ? `heartRate${index + 1}` : "heartRate2";

            return(
            <div key={`item-${index}`}>
<p style={{ color: entry.color }}>
  Lactate{index + 1}: {entry.payload[lactateKey]} mmol/L
</p>              
<p style={{ color: entry.color }}>
Heart Rate{index + 1}: {entry.payload[heartRateKey]} Bpm
</p>             
            </div>)
    })}
        </div>
      );
    }
  
    return null;
  };
  const paceDomain = chartData.sport === 'run' || chartData.sport === 'swim' ? ['dataMax', 'dataMin'] : ['auto', 'auto'];
  if (chartData.sport === 'run') {
    chartData.sort((a, b) => a.powerOrPace - b.powerOrPace);
}
console.log(data);
 
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
     
      <ResponsiveContainer width="100%" height={400}>
        <LineChart width={500} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  type="number"
  dataKey="power"
  name={chartData.sport === 'run' || chartData.sport === 'swim' ? "Pace" : "Power"}
  unit={chartData.sport === 'run' || chartData.sport === 'swim' ? "/km" : "W"}
  domain={paceDomain} // Apply the calculated domain here
  
  tickFormatter={(tick) => chartData.sport === 'run' || chartData.sport === 'swim' ? secondsToPace(tick) : tick.toString()}
/>
          <YAxis unit="Bpm" yAxisId="right" orientation="right" domain={[60, 'dataMax']} />
          <YAxis unit="mmol/L" yAxisId="left" orientation="left"  />

          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {testings.map((testing, index) => {
  const dateOnly = testing.date.split(' ')[0]; // Get the date without the time

  return (
    <Line
      key={index}
      yAxisId="left"
      type="linear"
      dataKey={`lactate${index + 1}`}
      name={`Lactate on ${dateOnly}`} // Label the line with the date
      stroke={colors[index % colors.length]}
      dot={true}
      connectNulls // Connect the line over missing data points
      isAnimationActive={false}
    />
  );
})}

 {showHeartRate && (
            <Line yAxisId="right"       type="linear"
            dataKey="heartRate1" stroke="#82ca9d" dot={true} isAnimationActive={false} />
          )}
            {lt1 && (
                    <ReferenceLine x={lt1} stroke="green" label="LT1" />
                )}
                {lt2 && (
                    <ReferenceLine x={lt2} stroke="red" label="LT2" />
                )}
        </LineChart>
       { testings.length < 2 &&( <FormControlLabel
        control={<Switch checked={showHeartRate} onChange={handleToggleHeartRate} />}
        label="Show Heart Rate"
      /> )}
        {testings.length > 0 && testings
        .length < 2 && renderTestingInfo(testings[0])}

      </ResponsiveContainer>
      {renderEditUI && (
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: -5 }}>
              <IconButton onClick={handleAddPoint} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={handleResetChanges} color="secondary">
                <RestartAltIcon />
              </IconButton>
            </Box>
            <div>
              {chartData.map((point, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TextField label={`Power ${index + 1}`} variant="outlined" type="number"
                  value={point.power} onChange={(e) => handleValueChange(index, 'power', e.target.value)} />
                  <TextField label={`Lactate ${index + 1}`} variant="outlined" type="number" value={point.lactate1} onChange={(e) => handleValueChange(index, 'lactate', e.target.value)} />
                  <TextField label={`Heart Rate ${index + 1}`} variant="outlined" type="number" value={point.heartRate1} onChange={(e) => handleValueChange(index, 'heartRate', e.target.value)} />
                  <IconButton onClick={() => removeInputField(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

            </div>
            <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ alignSelf: 'flex-end', mt: 2 }}>
              Save Changes
            </Button>
          </div>
        )}
    </Box>
  );
};

export default ChartComponent;

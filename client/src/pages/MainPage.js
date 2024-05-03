import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import Sidebar from '../components/Sidebar'; // Adjust the import path as needed
import ChartComponent from '../components/ChartShow/ChartComponent';
import athletes from '../data/athletes.json'; 
import measurements from '../data/measurements.json'; 
import PowerLactateForm from '../components/PowerLactateForm';
import BarChartComponent from '../components/BarChartComponent';

const MainPage = () => {
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [selectedTestingId, setSelectedTestingId] = useState(null);
  const [testingsForAthlete, setTestingsForAthlete] = useState([]);
  const [isCreatingNewTesting, setIsCreatingNewTesting] = useState(false);
  const [selectedTestingIds, setSelectedTestingIds] = useState([]);

  const selectedAthlete = athletes.find(athlete => athlete.id === selectedAthleteId);
  const handleCreateNewTesting = () => {
    if (isCreatingNewTesting === true) {

        setIsCreatingNewTesting(false);
    } else {
        setIsCreatingNewTesting(true);

    }
  }; 
  const handleSelectTesting = (testingId) => {
    setSelectedTestingIds((prev) =>
      prev.includes(testingId) ? prev.filter((id) => id !== testingId) : [...prev, testingId]
    );
  };
  const handleSaveNewTesting = (newTestingDetails) => {
    setIsCreatingNewTesting(false);
  };
  useEffect(() => {
    if (selectedAthleteId) {
      const relatedTestings = measurements
        .filter(measurement => measurement.athleteId === selectedAthleteId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setTestingsForAthlete(relatedTestings);
      setSelectedTestingId(null);
    }
    setIsCreatingNewTesting(false);
  }, [selectedAthleteId]);
  const groupedBySport = testingsForAthlete.reduce((acc, curr) => {
    (acc[curr.sport] = acc[curr.sport] || []).push(curr);
    return acc;
  }, {});

  Object.keys(groupedBySport).forEach(sport => {
    groupedBySport[sport].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const selectedTestings = measurements.filter((measurement) =>
  selectedTestingIds.includes(measurement.id)
);
useEffect(() => {
  if (selectedAthleteId) {
    const relatedTestings = measurements
      .filter(measurement => measurement.athleteId === selectedAthleteId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTestingsForAthlete(relatedTestings);
    setSelectedTestingIds([]); // Reset the selected testings for the new athlete
  }
  setIsCreatingNewTesting(false);
}, [selectedAthleteId]);

  return (
    <>
    
    <Box sx={{ display: 'flex', p: 3 }}>  
      <Sidebar
        athletes={athletes}
        selectedAthleteId={selectedAthleteId}
        onSelectAthlete={setSelectedAthleteId}

      />
      <Box sx={{ flex: 1, ml: 3 }}>
        {selectedAthlete && (
          <Typography variant="h4" gutterBottom>
            {selectedAthlete.name}
          </Typography>
        )}
        <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', mb: 2 }}>
            {Object.entries(groupedBySport).map(([sport, testings]) => (
                 <Box key={sport} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                     <Typography variant="h6">{sport.charAt(0).toUpperCase() + sport.slice(1)}</Typography>
              {testings.map((testing) => (
               <Button
               key={testing.id}
               variant="outlined"
               sx={{
                 mb: 1,
                 mr: 1,
                 bgcolor: selectedTestingIds.includes(testing.id) ? 'primary.dark' : 'inherit',
                 color: selectedTestingIds.includes(testing.id) ? '#fff' : 'inherit',
                 '&:hover': {
                   bgcolor: 'primary.main',
                   color: '#fff',
                 },
               }}
               onClick={() => handleSelectTesting(testing.id)}
             >
               {new Date(testing.date).toLocaleDateString()}
             </Button>
             
                    ))}
                    </Box>
              ))}
            </Box>
            {selectedAthlete && 
            <Button variant="contained" size="small" onClick={() => handleCreateNewTesting()} sx={{  mt: 3, height: "30px" }}>
               New Testing
            </Button>
}
        </Box>
        {isCreatingNewTesting && 
        <PowerLactateForm 
          onSaveNewTesting={handleSaveNewTesting} 
          athleteId={selectedAthleteId} 
        />
      }
{selectedTestings.length > 0 && (
  <div>
    {selectedTestings.map((testing, index) => (
      <>
      <Typography key={index} variant="h6" gutterBottom>
        Testing Date: {new Date(testing.date).toLocaleDateString()}
      </Typography>

     </>
    ))}
    <Paper elevation={3} sx={{ p: 2 }}>
      <ChartComponent testings={selectedTestings} />
      {selectedTestings.length === 1 &&(
  <div>
 

    <Paper elevation={3} sx={{ p: 2 }}>
      <BarChartComponent testings={selectedTestings} />
    </Paper>
  </div>
)}

    </Paper>
  </div>
)}
     </Box>
    </Box>
    </>
  );
};

export default MainPage;

import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Paper, useTheme } from "@mui/material";
import Sidebar from "../components/Sidebar"; // Adjust the import path as needed
import ChartComponent from "../components/ChartComponent";
import athletes from "../data/athletes.json";
import measurements from "../data/measurements.json";
import PowerLactateForm from "../components/PowerLactateForm";
import BarChartComponent from "../components/BarChartComponent";
import Login from "../components/Login";
import AthleteProfile from "../components/AthleteProfile";
import EditAthleteModal from "../components/EditAthleteModal";
import { useMediaQuery } from "@mui/material";

const MainPage = () => {
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [testingsForAthlete, setTestingsForAthlete] = useState([]);
  const [isCreatingNewTesting, setIsCreatingNewTesting] = useState(false);
  const [selectedTestingIds, setSelectedTestingIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  const selectedAthlete = athletes.find(
    (athlete) => athlete.id === selectedAthleteId
  );
  useEffect(() => {
    const foundAthlete = athletes.find(
      (athlete) => athlete.id === selectedAthleteId
    );
    setCurrentAthlete(foundAthlete);
  }, [selectedAthleteId]);

  const handleEditAthlete = () => {
    console.log("Edit profile clicked");

    setEditModalOpen(true);
  };
  const handleOpenNewAthleteModal = () => {
    setCurrentAthlete({
      name: "",
      age: "",
      weight: "",
      personalBests: [],
      injuries: [],
      bikeZones: { lt1: ["", ""], lt2: ["", ""], l3: ["", ""], vo2: ["", ""] },
      runZones: { lt1: ["", ""], lt2: ["", ""], l3: ["", ""], vo2: ["", ""] },
    });
    setEditModalOpen(true);
  };

  const handleSaveAthlete = (athleteDetails) => {
    console.log("Athlete Saved:", athleteDetails);
    setEditModalOpen(false);
    // Save athlete details to state or backend here
  };
  const handleSignOut = () => {
    setIsLoggedIn(false); // Simulating sign out
    // Normally, you'd also clear session/storage data here if applicable
  };
  const handleAddNewAthlete = () => {
    // Handle the logic to add a new athlete (show form or modal)
    console.log("Add new athlete");
  };

  const handleCreateNewTesting = () => {
    if (isCreatingNewTesting === true) {
      setIsCreatingNewTesting(false);
    } else {
      setIsCreatingNewTesting(true);
    }
  };
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelectTesting = (testingId) => {
    const testing = measurements.find(
      (measurement) => measurement.id === testingId
    );
    if (!testing) return;
    if (selectedTestingIds.includes(testingId)) {
      setSelectedTestingIds(
        selectedTestingIds.filter((id) => id !== testingId)
      );
    } else {
      const isIncompatible = selectedTestingIds.some((id) => {
        const existingTest = measurements.find((m) => m.id === id);
        return existingTest.sport !== testing.sport;
      });
      if (isIncompatible) {
        alert("Cannot select tests from different sports!");
        return;
      }
      setSelectedTestingIds([...selectedTestingIds, testingId]);
    }
  };

  const handleSaveNewTesting = (newTestingDetails) => {
    setIsCreatingNewTesting(false);
  };
  useEffect(() => {
    if (selectedAthleteId) {
      const filteredMeasurements = measurements
        .filter((measurement) => measurement.athleteId === selectedAthleteId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTestingsForAthlete(filteredMeasurements);
      setSelectedTestingIds([]);
    }
  }, [selectedAthleteId]);

  const groupedBySport = testingsForAthlete.reduce((acc, curr) => {
    (acc[curr.sport] = acc[curr.sport] || []).push(curr);
    return acc;
  }, {});

  Object.keys(groupedBySport).forEach((sport) => {
    groupedBySport[sport].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const selectedTestings = measurements.filter((measurement) =>
    selectedTestingIds.includes(measurement.id)
  );
  useEffect(() => {
    if (selectedAthleteId) {
      const relatedTestings = measurements
        .filter((measurement) => measurement.athleteId === selectedAthleteId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setTestingsForAthlete(relatedTestings);
      setSelectedTestingIds([]); // Reset the selected testings for the new athlete
    }
    setIsCreatingNewTesting(false);
  }, [selectedAthleteId]);
  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }
  return (
    <>
      <Box sx={{ display: "flex", p: 3 }}>
        <Sidebar
          athletes={athletes}
          selectedAthleteId={selectedAthleteId}
          onSelectAthlete={setSelectedAthleteId}
          onAddNewAthlete={handleOpenNewAthleteModal}
          onSignOut={handleSignOut}
        />
        <Box sx={{ flex: 1, ml: { xs: 0, sm: 1, md: 3 } }}>
          <AthleteProfile
            athlete={selectedAthlete}
            onEdit={handleEditAthlete}
          />

          {editModalOpen && (
            <EditAthleteModal
              athlete={currentAthlete}
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSave={handleSaveAthlete}
            />
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: isMobile ? "column" : "row", // This will dynamically change based on the screen size
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              {Object.entries(groupedBySport).map(([sport, testings]) => (
                <Box
                  key={sport}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </Typography>
                  {testings.map((testing) => (
                    <Button
                      key={testing.id}
                      variant="outlined"
                      disabled={
                        selectedTestingIds.length > 0 &&
                        selectedTestingIds[0] !== testing.id &&
                        measurements.find((m) => m.id === selectedTestingIds[0])
                          ?.sport !== testing.sport
                      }
                      sx={{
                        mb: 1,
                        mr: 1,
                        bgcolor: selectedTestingIds.includes(testing.id)
                          ? "primary.dark"
                          : "inherit",
                        color: selectedTestingIds.includes(testing.id)
                          ? "#fff"
                          : "inherit",
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "#fff",
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
            {selectedAthlete && (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleCreateNewTesting()}
                sx={{ mt: 3, height: "30px" }}
              >
                New Testing
              </Button>
            )}
          </Box>
          {isCreatingNewTesting && (
            <PowerLactateForm
              onSaveNewTesting={handleSaveNewTesting}
              athleteId={selectedAthleteId}
            />
          )}
          {selectedTestings.length > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {selectedTestings.map((testing, index) => (
                  <Typography
                    key={index}
                    variant="h6"
                    gutterBottom
                    sx={{ m: 2, color: colors[index % colors.length] }}
                  >
                    Testing Date: {new Date(testing.date).toLocaleDateString()}
                  </Typography>
                ))}
              </div>
              <Paper elevation={3} sx={{ p: 2 }}>
                <ChartComponent testings={selectedTestings} />
                {selectedTestings.length === 1 && (
                  <div>
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <BarChartComponent testings={selectedTestings} />
                    </Paper>
                  </div>
                )}
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MainPage;

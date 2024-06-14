import React, { useState, useEffect, useContext } from "react";
import { Button, Box, Typography, Paper, useTheme } from "@mui/material";
import Sidebar from "../components/Sidebar"; // Adjust the import path as needed
import ChartComponent from "../components/ChartComponent/ChartComponent";
import PowerLactateForm from "../components/PowerLactateForm";
import BarChartComponent from "../components/ChartComponent/BarChartComponent";
import AthleteProfile from "../components/Athlete/AthleteProfile";
import EditAthleteModal from "../components/Athlete/EditAthleteModal";
import { useMediaQuery } from "@mui/material";
import {
  logoutUser,
  fetchAthletesByUser,
  fetchMeasurementsByAthlete,
  saveNewTesting,
} from "../apiService";
import { Link, useNavigate } from "react-router-dom";

const MainPage = () => {
  const [selectedAthleteId, setSelectedAthleteId] = useState(
    localStorage.getItem("selectedAthleteId")
  );
  const [selectedTestingIds, setSelectedTestingIds] = useState(
    JSON.parse(localStorage.getItem("selectedTestingIds") || "[]")
  );
  const [testingsForAthlete, setTestingsForAthlete] = useState([]);
  const [isCreatingNewTesting, setIsCreatingNewTesting] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const selectedAthlete = athletes.find(
    (athlete) => athlete._id === selectedAthleteId
  );
  useEffect(() => {
    const foundAthlete = athletes.find(
      (athlete) => athlete._id === selectedAthleteId
    );
    setCurrentAthlete(foundAthlete);
    console.log(currentAthlete);
  }, [selectedAthleteId]);
  useEffect(() => {
    localStorage.setItem("selectedAthleteId", selectedAthleteId);
    localStorage.setItem(
      "selectedTestingIds",
      JSON.stringify(selectedTestingIds)
    );
  }, [selectedAthleteId, selectedTestingIds]);

  useEffect(() => {
    fetchAthletesByUser()
      .then(setAthletes)
      .catch((error) => {
        console.error("Failed to fetch athletes", error);
        setError(
          "Failed to connect. Please check your internet connection or try logging in again."
        );
        navigate("/login");
      });
  }, []);
  useEffect(() => {
    if (!selectedAthleteId) return;
    fetchMeasurementsByAthlete(selectedAthleteId)
      .then(setTestingsForAthlete)
      .catch((error) => console.error("Failed to fetch measurements", error));
  }, [selectedAthleteId]);
  useEffect(() => {
    const foundAthlete = athletes.find(
      (athlete) => athlete._id === selectedAthleteId
    );
    setCurrentAthlete(foundAthlete);
  }, [athletes, selectedAthleteId]);

  const handleEditAthlete = () => {
    console.log("Edit profile clicked");

    setEditModalOpen(true);
  };

  const handleOpenNewAthleteModal = () => {
    setCurrentAthlete({
      _id: null,
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
  };
  const handleSignOut = async () => {
    navigate("/login");
    await logoutUser(navigate);
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
    console.log(testingId);
    const testing = testingsForAthlete.find(
      (measurement) => measurement._id === testingId
    );
    console.log(testing);
    if (!testing) return;
    if (selectedTestingIds.includes(testingId)) {
      setSelectedTestingIds(
        selectedTestingIds.filter((_id) => _id !== testingId)
      );
    } else {
      const isIncompatible = selectedTestingIds.some((_id) => {
        const existingTest = testingsForAthlete.find((m) => m._id === _id);
        return existingTest.sport !== testing.sport;
      });
      if (isIncompatible) {
        alert("Cannot select tests from different sports!");
        return;
      }
      setSelectedTestingIds([...selectedTestingIds, testingId]);
    }
  };

  const handleSaveNewTesting = async (newTestingDetails) => {
    if (!selectedAthleteId || !newTestingDetails) {
      alert("Please fill in all required testing details.");
      return;
    }

    try {
      // Call the API service to save the new testing
      const savedTesting = await saveNewTesting(newTestingDetails);
      console.log("Testing saved successfully:", savedTesting);
      setTestingsForAthlete((prev) => [...prev, savedTesting]); // Update local state
      setIsCreatingNewTesting(false); // Close form or modal
    } catch (error) {
      console.error("Error saving testing:", error);
      alert("Failed to save testing data.");
    }
  };
  useEffect(() => {
    if (selectedAthleteId) {
      const filteredMeasurements = testingsForAthlete
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

  const selectedTestings = testingsForAthlete.filter((measurement) =>
    selectedTestingIds.includes(measurement._id)
  );
  useEffect(() => {
    if (selectedAthleteId) {
      const relatedTestings = testingsForAthlete
        .filter((measurement) => measurement.athleteId === selectedAthleteId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setTestingsForAthlete(relatedTestings);
      setSelectedTestingIds([]); // Reset the selected testings for the new athlete
    }
    setIsCreatingNewTesting(false);
  }, [selectedAthleteId]);

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
        <Box sx={{ flex: 1 }}>
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
                      key={testing._id}
                      variant="outlined"
                      disabled={
                        selectedTestingIds.length > 0 &&
                        selectedTestingIds[0] !== testing._id &&
                        testingsForAthlete.find(
                          (m) => m._id === selectedTestingIds[0]
                        )?.sport !== testing.sport
                      }
                      sx={{
                        mb: 1,
                        mr: 1,
                        bgcolor: selectedTestingIds.includes(testing._id)
                          ? "primary.dark"
                          : "inherit",
                        color: selectedTestingIds.includes(testing._id)
                          ? "#fff"
                          : "inherit",
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "#fff",
                        },
                      }}
                      onClick={() => handleSelectTesting(testing._id)}
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
                sx={{ mt: 3, height: "50px" }}
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
                    {!isMobile && <span> Testing Date:</span>}
                    {new Date(testing.date).toLocaleDateString()}
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

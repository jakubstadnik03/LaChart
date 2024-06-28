import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Paper, useTheme } from "@mui/material";
import ChartComponent from "../components/ChartComponent/ChartComponent";
import PowerLactateForm from "../components/ChartComponent/PowerLactateForm";
import BarChartComponent from "../components/ChartComponent/BarChartComponent";
import { useMediaQuery } from "@mui/material";
import { fetchMeasurementsByAthlete, saveNewTesting } from "../apiService";

const TestingPage = ({
  selectedAthleteId,
  athletes,
  setCurrentAthlete,
  selectedAthlete,
}) => {
  const [selectedTestingIds, setSelectedTestingIds] = useState(
    JSON.parse(localStorage.getItem("selectedTestingIds") || "[]")
  );
  const [selectedTestings, setSelectedTestings] = useState(
    JSON.parse(localStorage.getItem("selectedTestings") || "[]")
  );
  const [testingsForAthlete, setTestingsForAthlete] = useState([]);
  const [isCreatingNewTesting, setIsCreatingNewTesting] = useState(
    JSON.parse(localStorage.getItem("isCreatingNewTesting")) || false
  );
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    localStorage.setItem("selectedAthleteId", selectedAthleteId);
  }, [selectedAthleteId]);
  useEffect(() => {
    localStorage.setItem(
      "selectedTestingIds",
      JSON.stringify(selectedTestingIds)
    );
  }, [selectedTestingIds]);

  useEffect(() => {
    localStorage.setItem("selectedTestings", JSON.stringify(selectedTestings));
    setSelectedTestingIds(selectedTestings.map((testId) => testId._id));
  }, [selectedTestings]);

  useEffect(() => {
    localStorage.setItem(
      "isCreatingNewTesting",
      JSON.stringify(isCreatingNewTesting)
    );
  }, [isCreatingNewTesting]);

  useEffect(() => {
    if (!selectedAthleteId) return;
    fetchMeasurementsByAthlete(selectedAthleteId)
      .then((data) => {
        setTestingsForAthlete(data);
        const selectedTestingsData = data.filter((measurement) =>
          selectedTestingIds.includes(measurement._id)
        );
        setSelectedTestings(selectedTestingsData);
      })
      .catch((error) => console.error("Failed to fetch measurements", error));
  }, [selectedAthleteId]);

  useEffect(() => {
    const foundAthlete = athletes.find(
      (athlete) => athlete._id === selectedAthleteId
    );
    setCurrentAthlete(foundAthlete);
  }, [athletes, selectedAthleteId]);

  const handleCreateNewTesting = () => {
    setIsCreatingNewTesting((prev) => !prev);
  };

  const handleSelectTesting = (testingId) => {
    const testing = testingsForAthlete.find(
      (measurement) => measurement._id === testingId
    );
    if (!testing) return;
    setSelectedTestingIds((prev) => {
      const newSelectedTestingIds = prev.includes(testingId)
        ? prev.filter((_id) => _id !== testingId)
        : [...prev, testingId];

      const isIncompatible = newSelectedTestingIds.some((_id) => {
        const existingTest = testingsForAthlete.find((m) => m._id === _id);
        return existingTest.sport !== testing.sport;
      });
      if (isIncompatible) {
        alert("Cannot select tests from different sports!");
        return prev;
      }

      const newSelectedTestings = testingsForAthlete.filter((measurement) =>
        newSelectedTestingIds.includes(measurement._id)
      );
      setSelectedTestings(newSelectedTestings);
      localStorage.setItem(
        "selectedTestingIds",
        JSON.stringify(newSelectedTestingIds)
      );
      localStorage.setItem(
        "selectedTestings",
        JSON.stringify(newSelectedTestings)
      );
      return newSelectedTestingIds;
    });
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

  // Clear selected testings for new athlete
  useEffect(() => {
    if (selectedAthleteId) {
      const filteredMeasurements = testingsForAthlete
        .filter((measurement) => measurement.athleteId === selectedAthleteId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTestingsForAthlete(filteredMeasurements);
      setSelectedTestingIds([]);
      setSelectedTestings([]);
    }
  }, [selectedAthleteId]);

  const groupedBySport = testingsForAthlete.reduce((acc, curr) => {
    (acc[curr.sport] = acc[curr.sport] || []).push(curr);
    return acc;
  }, {});

  Object.keys(groupedBySport).forEach((sport) => {
    groupedBySport[sport].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return (
    <>
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
            variant="outlined"
            size="small"
            onClick={() => handleCreateNewTesting()}
            sx={{
              mt: 3,
              height: "50px",
              bgcolor: isCreatingNewTesting ? "primary.dark" : "inherit",
              color: isCreatingNewTesting ? "#fff" : "inherit",
              "&:hover": {
                bgcolor: "primary.main",
                color: "#fff",
              },
            }}
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
    </>
  );
};

export default TestingPage;

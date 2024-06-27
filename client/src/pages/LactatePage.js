import React, { useState, useEffect } from "react";
import LactateForm from "../components/Lactate/LactateForm";
import LactateChart from "../components/Lactate/LactateChart";
import TestingTable from "../components/Lactate/TestingTable";
import { listlactates } from "../apiService";
import { Button, Box } from "@mui/material";

const LactatePage = ({ selectedAthleteId }) => {
  const [lactates, setLactates] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    listlactates(selectedAthleteId)
      .then((fetchedAthletes) => {
        setLactates(fetchedAthletes);
      })
      .catch((error) => {
        console.error("Failed to fetch athletes", error);
        setError(
          "Failed to connect. Please check your internet connection or try logging in again."
        );
      });
  }, [selectedAthleteId]);

  const toggleFormVisibility = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={toggleFormVisibility}
          sx={{
            bgcolor: showForm ? "primary.dark" : "inherit",
            color: showForm ? "#fff" : "inherit",
            "&:hover": {
              bgcolor: "primary.main",
              color: "#fff",
            },
          }}
        >
          {showForm ? "Hide Form" : "Show Form"}
        </Button>
      </Box>
      {showForm && <LactateForm selectedAthleteId={selectedAthleteId} />}
      <LactateChart selectedAthleteId={selectedAthleteId} datas={lactates} />
      <TestingTable datas={lactates} selectedAthleteId={selectedAthleteId} />
    </>
  );
};

export default LactatePage;

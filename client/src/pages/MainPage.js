import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Paper, useTheme } from "@mui/material";
import AthleteProfile from "../components/Athlete/AthleteProfile";
import EditAthleteModal from "../components/Athlete/EditAthleteModal";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/User/Sidebar";
import {
  logoutUser,
  fetchAthletesByUser,
  fetchAthletesByCoach,
  getUser,
} from "../apiService";
import TestingPage from "./TestingPage";
import LactatePage from "./LactatePage";

const MainPage = () => {
  const [athletes, setAthletes] = useState([]);
  const [user, setUser] = useState(null); // State to store user info
  const [error, setError] = useState("");
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState(
    localStorage.getItem("selectedAthleteId")
  );
  const [showComponent, setShowComponent] = useState(
    localStorage.getItem("showComponent") || ""
  );

  const handleToggleComponent = (componentName) => {
    const newComponent = showComponent === componentName ? "" : componentName;
    setShowComponent(newComponent);
    localStorage.setItem("showComponent", newComponent);
  };

  const navigate = useNavigate();
  const selectedAthlete = athletes.find(
    (athlete) => athlete._id === selectedAthleteId
  );

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        let fetchedAthletes = [];
        if (user?.role === "coach") {
          fetchedAthletes = await fetchAthletesByCoach();
        } else {
          fetchedAthletes = await fetchAthletesByUser();
        }

        setAthletes(fetchedAthletes);

        if (user?.role === "athlete" && fetchedAthletes.length === 0) {
          handleOpenNewAthleteModal();
          setEditModalOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch athletes", error);
        setError(
          "Failed to connect. Please check your internet connection or try logging in again."
        );
        navigate("/login");
      }
    };

    if (user) {
      fetchAthletes();
    }
  }, [user, navigate]);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch((error) => {
        console.error("Failed to fetch user", error);
        setError(
          "Failed to connect. Please check your internet connection or try logging in again."
        );
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    const foundAthlete = athletes.find(
      (athlete) => athlete._id === selectedAthleteId
    );
    setCurrentAthlete(foundAthlete);
  }, [selectedAthleteId, athletes]);

  const handleSignOut = async () => {
    navigate("/login");
    await logoutUser(navigate);
  };
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

  return (
    <>
      <Box sx={{ display: "flex", p: 3 }}>
        <Sidebar
          athletes={athletes}
          selectedAthleteId={selectedAthleteId}
          onSelectAthlete={(id) => {
            setSelectedAthleteId(id);
            localStorage.setItem("selectedAthleteId", id);
          }}
          onAddNewAthlete={handleOpenNewAthleteModal}
          onSignOut={handleSignOut}
          user={user}
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
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mb: 2, mr: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleToggleComponent("testing")}
                sx={{
                  bgcolor: showComponent.includes("testing")
                    ? "primary.dark"
                    : "inherit",
                  color: showComponent.includes("testing") ? "#fff" : "inherit",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "#fff",
                  },
                }}
              >
                Lactate Testing
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleToggleComponent("measurement")}
                sx={{
                  bgcolor: showComponent.includes("measurement")
                    ? "primary.dark"
                    : "inherit",
                  color: showComponent.includes("measurement")
                    ? "#fff"
                    : "inherit",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "#fff",
                  },
                }}
              >
                Lactate Measurement
              </Button>
            </Box>
          </Box>
          {showComponent === "testing" && (
            <TestingPage
              selectedAthleteId={selectedAthleteId}
              selectedAthlete={selectedAthlete}
              athletes={athletes}
              setCurrentAthlete={setCurrentAthlete}
            />
          )}
          {showComponent === "measurement" && (
            <>
              <LactatePage selectedAthleteId={selectedAthleteId} />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MainPage;

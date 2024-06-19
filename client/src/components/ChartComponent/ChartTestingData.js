import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTheme, useMediaQuery } from "@mui/material";
import { editTesting, deleteTesting } from "../../apiService";

const ChartTestingData = ({
  testings,
  secondsToPace,
  paceToSeconds,
  testing,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(testings);
  const [originalData, setOriginalData] = useState([]);
  useEffect(() => {
    setChartData(testings);
  }, [testings]);

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const handleDeleteTesting = async () => {
    if (!testing || testing.length === 0) {
        console.error("No testings available to delete.");
        alert("No testings available to delete.");
        return;
    }

    const testingId = testing[0]._id;

    try {
        const response = await deleteTesting(testingId);
        if(response.status === 200) { // Assuming the backend sends a 200 OK on successful deletion
            alert("Testing deleted successfully!");
           
            setChartData(prevChartData => prevChartData.filter(t => t._id !== testingId));
        } else {
            throw new Error('Failed to delete the testing.');
        }
    } catch (error) {
        console.error("Error deleting testing:", error);
        alert("Failed to delete testing.");
    }
};



const handleSaveChanges = async () => {
  const testingId = testing[0]?._id;
  const updatedData = {
      points: chartData.map(({ power, lactate1, heartRate1 }) => ({
          power: testing[0]?.sport === "run" || (testing[0]?.sport === "swim" && typeof power === "string")
              ? paceToSeconds(power)
              : power,
          lactate: Number(lactate1),
          heartRate: Number(heartRate1),
      })),
  };

  try {
      await editTesting(testingId, updatedData);
      alert("Testing updated successfully!");
      // Update the chartData state to reflect the new data
      setChartData(chartData.map(item => item._id === testingId ? updatedData : item));
  } catch (error) {
      console.error("Failed to update testing:", error);
      alert("Failed to update testing.");
  }
};

  const removeInputField = (index) => {
    const newInputFields = [...chartData];
    newInputFields.splice(index, 1);
    setChartData(newInputFields);
  };
  const handleAddPoint = () => {
    setChartData(chartData.concat([{ power: "", lactate: "", heartRate: "" }]));
  };

  const handleResetChanges = () => {
    setChartData(originalData); // Ensure originalData is properly set when data is first loaded
  };
  const handleValueChange = (index, field, value) => {
    const newData = [...chartData];
    if (
      (field === "power" && testing[0]?.sport === "run") ||
      (field === "power" && testing[0]?.sport === "swim")
    ) {
      console.log(value);
      newData[index][field] = value;
      console.log(newData);
    } else {
      newData[index][field] = Number(value);
    }
    setChartData(newData);
  };

  useEffect(() => {
    setOriginalData(chartData); // Set original data when chartData is first loaded or changed
  }, [chartData]);
  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
            mt: isLargeScreen ? -4 : 5,
          }}
        >
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteTesting}
          >
            Delete
          </Button>
          <IconButton onClick={handleAddPoint} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={handleResetChanges} color="secondary">
            <RestartAltIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ alignSelf: "flex-start", mt: 0, ml: 0 }}
          >
            Save
          </Button>
        </Box>
        <div style={{ marginTop: isLargeScreen ? "0px" : "0px" }}>
          {chartData.map((point, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <TextField
                  label={
                    testing[0].sport === "run"
                      ? `Pace ${index + 1}`
                      : testings[0].sport === "swim"
                      ? `Pace ${index + 1}`
                      : `Power ${index + 1}`
                  }
                  variant="outlined"
                  value={
                    testing[0]?.sport === "run" || testing[0]?.sport === "swim"
                      ? typeof point.power === "number"
                        ? secondsToPace(point.power)
                        : point.power
                      : point.power
                  }
                  onChange={(e) =>
                    handleValueChange(index, "power", e.target.value)
                  }
                />
                <TextField
                  label={`Lactate ${index + 1}`}
                  variant="outlined"
                  type="number"
                  value={point.lactate1}
                  onChange={(e) =>
                    handleValueChange(index, "lactate1", e.target.value)
                  }
                />
                <TextField
                  label={`Heart Rate ${index + 1}`}
                  variant="outlined"
                  type="number"
                  value={point.heartRate1}
                  onChange={(e) =>
                    handleValueChange(index, "heartRate1", e.target.value)
                  }
                />
                <IconButton
                  onClick={() => removeInputField(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChartTestingData;

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  TablePagination,
  IconButton,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteLactateTesting, updateLactateTesting } from "../../apiService";
import EditLactateModal from "./EditLactateModal";

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
};

const TestingTable = ({ datas, selectedAthleteId, setLactates }) => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentLactate, setCurrentLactate] = useState(null);

  useEffect(() => {
    setData(
      datas.filter((measurement) => measurement.athleteId === selectedAthleteId)
    );
  }, [datas, selectedAthleteId]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (testing, index) => {
    console.log(testing);
    setCurrentLactate({ ...testing, index });
    setOpenEditModal(true);
  };

  const handleDelete = async (testing, index) => {
    if (window.confirm("Are you sure you want to delete this testing?")) {
      try {
        console.log(testing._id);
        await deleteLactateTesting(testing._id); // Implement this API call in your apiService
        // Refresh the data after deletion
        const updatedData = data
          .map((d) => {
            if (d._id === testing._id) {
              const updatedTestings = d.testings.filter((t, i) => i !== index);
              return { ...d, testings: updatedTestings };
            }
            return d;
          })
          .filter((d) => d.testings.length > 0); // Remove entries with no testings
        setData(updatedData); // Update state with the filtered data
      } catch (error) {
        console.error("Failed to delete testing", error);
      }
    }
  };

  const filteredData = data.filter((item) => {
    switch (filter) {
      case "low":
        return item.testings.some((t) => t.lactate <= 2);
      case "medium":
        return item.testings.some((t) => t.lactate > 2 && t.lactate <= 4);
      case "high":
        return item.testings.some((t) => t.lactate > 4);
      default:
        return true;
    }
  });

  const sortedData = filteredData.sort(getComparator(order, orderBy));
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatIntervalLength = (minutes = "0", seconds = "0") => {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatPace = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} /km`;
  };

  return (
    <Box sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lactate Testing Table
      </Typography>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="low">Lactate ≤ 2</MenuItem>
          <MenuItem value="medium">Lactate 2-4</MenuItem>
          <MenuItem value="high">Lactate {">"} 4</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }} aria-label="lactate testing table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={() => handleRequestSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "power"}
                  direction={orderBy === "power" ? order : "asc"}
                  onClick={() => handleRequestSort("power")}
                >
                  Pace / Power
                </TableSortLabel>
              </TableCell>
              <TableCell>Heart Rate (bpm)</TableCell>
              <TableCell>Interval Length</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "effort"}
                  direction={orderBy === "effort" ? order : "asc"}
                  onClick={() => handleRequestSort("effort")}
                >
                  Effort
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "lactate"}
                  direction={orderBy === "lactate" ? order : "asc"}
                  onClick={() => handleRequestSort("lactate")}
                >
                  Lactate (mmol/L)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "sport"}
                  direction={orderBy === "sport" ? order : "asc"}
                  onClick={() => handleRequestSort("sport")}
                >
                  Sport
                </TableSortLabel>
              </TableCell>
              <TableCell>Weather</TableCell>
              {paginatedData[0]?.sport === "bike" && (
                <TableCell>Bike Type</TableCell>
              )}
              {paginatedData[0]?.sport === "swim" && (
                <TableCell>Pool Length</TableCell>
              )}
              {paginatedData[0]?.sport === "run" && (
                <TableCell>Terrain</TableCell>
              )}
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((testing) => (
              <React.Fragment key={testing.date}>
                {testing.testings.map((measurement, index) => (
                  <TableRow key={index}>
                    {index === 0 && (
                      <TableCell rowSpan={testing.testings.length}>
                        {new Date(testing.date).toLocaleDateString()}
                      </TableCell>
                    )}
                    <TableCell>
                      {testing.sport === "bike"
                        ? `${measurement.power} W`
                        : formatPace(measurement.power)}
                    </TableCell>
                    <TableCell>{measurement.heartRate}</TableCell>
                    <TableCell>
                      {measurement.minutes !== "" &&
                        formatIntervalLength(
                          measurement.minutes,
                          measurement.seconds
                        )}
                      {measurement.minutes == "" &&
                        `${measurement.distance} km`}
                    </TableCell>
                    <TableCell>{measurement.effort}</TableCell>
                    <TableCell>{measurement.lactate}</TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.sport}
                        </TableCell>
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.weather}
                        </TableCell>
                        {testing.sport === "bike" && (
                          <TableCell rowSpan={testing.testings.length}>
                            {testing.bikeType}
                          </TableCell>
                        )}
                        {testing.sport === "swim" && (
                          <TableCell rowSpan={testing.testings.length}>
                            {testing.poolLength}
                          </TableCell>
                        )}
                        {testing.sport === "run" && (
                          <TableCell rowSpan={testing.testings.length}>
                            {testing.terrain}
                          </TableCell>
                        )}
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.description}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(testing, index)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(testing, index)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {currentLactate && (
        <EditLactateModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          lactateData={currentLactate}
        />
      )}
    </Box>
  );
};

export default TestingTable;

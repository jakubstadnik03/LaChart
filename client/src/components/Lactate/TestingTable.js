import React, { useState } from "react";
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
  useTheme,
  Grid,
} from "@mui/material";

// Helper function to sort data
const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
};

const TestingTable = ({ datas, selectedAthleteId }) => {
  const data = datas.filter(
    (measurement) => measurement.athleteId === selectedAthleteId
  );
  const theme = useTheme();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

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
                  Power (W)
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
              <TableCell>Weather</TableCell>
              <TableCell>Indoor/Outdoor</TableCell>
              <TableCell>Bike Type</TableCell>
              <TableCell>Description</TableCell>
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
                    <TableCell>{measurement.power}</TableCell>
                    <TableCell>{measurement.heartRate}</TableCell>
                    <TableCell>{measurement.intervalLength}</TableCell>
                    <TableCell>{measurement.effort}</TableCell>
                    <TableCell>{measurement.lactate}</TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.weather}
                        </TableCell>
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.indoorOutdoor}
                        </TableCell>
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.bikeType}
                        </TableCell>
                        <TableCell rowSpan={testing.testings.length}>
                          {testing.description}
                        </TableCell>
                      </>
                    )}
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
    </Box>
  );
};

export default TestingTable;

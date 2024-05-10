import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import GoalProgress from "./GoalProgress";
import LivePerformanceChart from "./LivePerformanceChart";

const Dashboard = ({ athleteData }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Athlete Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Goal Progress</Typography>
          <GoalProgress goal={100} current={athleteData.currentProgress} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Live Performance</Typography>
          <LivePerformanceChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

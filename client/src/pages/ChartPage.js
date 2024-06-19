import React from 'react'

const ChartPage = ({isCreatingNewTesting}) => {
  return (
    <>
<Box sx={{ display: "flex", p: 3 }}>

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

</>

)
}

export default ChartPage
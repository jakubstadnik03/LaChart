const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
let cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route Imports
const athletesRoutes = require("./routes/athletesRoutes");
const measurementsRoutes = require("./routes/measurementsRoutes");
const userListRoute = require("./routes/userListRoute");
const lactateRoute = require("./routes/lactateRoute");
// Routes Middleware
app.use("/athletes", athletesRoutes);
app.use("/measurements", measurementsRoutes);
app.use("/user", userListRoute);
app.use("/lactate", lactateRoute);

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Listening to the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

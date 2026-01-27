require("dotenv").config();
const express = require("express");
const cors = require("cors");

const locationRoutes = require("./routes/locations");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/detection-locations", locationRoutes);

app.get("/", (req, res) => {
  res.send("Tea Disease GPS API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

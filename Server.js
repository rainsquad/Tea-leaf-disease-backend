require("dotenv").config();
const express = require("express");
const cors = require("cors");

const locationRoutes = require("./routes/locations");
const communityRoutes = require("./routes/community");

const app = express();

app.use(cors());
app.use(express.json());

// Routes

//location
app.use("/api/detection-locations", locationRoutes);

//Community
app.use("/api/community", communityRoutes);


app.get("/", (req, res) => {
  res.send("Tea Disease GPS API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

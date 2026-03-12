const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Booking API running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Click Ctrl+C to stop the server");
});
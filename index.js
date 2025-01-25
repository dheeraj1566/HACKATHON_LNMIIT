const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/connection");
const patientRoutes = require ("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctor")


dotenv.config();
const app = express();

app.use(bodyParser.json());

connectDB();
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

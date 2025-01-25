const express = require("express");
const { createPatient, getAllPatients, loginPatient } = require("../controllers/patientController");

const router = express.Router();

router.post("/create", createPatient);
router.get("/", getAllPatients);
router.post("/login", loginPatient);

module.exports = router;
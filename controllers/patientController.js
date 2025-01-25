const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, age, contact, address, diagnosis, password } = req.body;

    // Validate required fields
    if (!name || !age || !contact || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, age, contact, and password are required fields."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({ name, age, contact, address, diagnosis, password: hashedPassword });
    await patient.save();

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login a patient
exports.loginPatient = async (req, res) => {
  try {
    const { contact, password } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ contact });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found."
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    // Generate token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      token,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
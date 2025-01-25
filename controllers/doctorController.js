const Doctor = require("../models/doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialization, licenseNumber, experience } = req.body;

    // Check if email is already registered
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      specialization,
      licenseNumber,
      experience
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Login a doctor
exports.loginDoctor = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found."
        });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials."
        });
      }
  
      // Generate token
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({
        success: true,
        token,
        data: doctor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
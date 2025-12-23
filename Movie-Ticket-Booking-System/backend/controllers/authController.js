import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; // Add this import for JWT
import User from "../models/User.js";


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  // smtp-relay.brevo.com
  port: process.env.EMAIL_PORT,  // 587
  secure: false,                 // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP connection successful! Ready to send emails.");
  }
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Send OTP to Email
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry

    // Store OTP (use Redis or TempOTP model in production)
    console.log(`OTP for ${email}: ${otp} (expires: ${new Date(otpExpiry)})`); // Demo

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: 'Your OTP for Registration',
      html: `
        <h2>Verification Code</h2>
        <p>Your 6-digit OTP is: <strong>${otp}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve and validate OTP (from storage)
    // e.g., const tempOtp = await TempOTP.findOne({ email, otp, expiresAt: { $gt: Date.now() } });
    const isValid = true; // Replace with actual check

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete used OTP
    // await TempOTP.deleteOne({ email });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password); // calls static method
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role || 'customer' 
      }, // Payload: Include only necessary non-sensitive data
      process.env.JWT_SECRET, // Use your env secret
      { 
        expiresIn: '15m' // Short expiry for access token; use refresh tokens for longer sessions
      }
    );

    // Return minimal user data (exclude password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      createdAt: user.createdAt,
      status: user.status
    };

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: userData 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
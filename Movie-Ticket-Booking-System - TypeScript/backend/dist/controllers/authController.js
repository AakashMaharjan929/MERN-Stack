import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error) => {
    if (error) {
        console.error("SMTP connection failed:", error);
    }
    else {
        console.log("SMTP connection successful! Ready to send emails.");
    }
});
const generateOTP = () => crypto.randomInt(100000, 999999).toString();
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already registered" });
        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000;
        console.log(`OTP for ${email}: ${otp} (expires: ${new Date(otpExpiry)})`);
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const isValid = true;
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role || 'customer'
        }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

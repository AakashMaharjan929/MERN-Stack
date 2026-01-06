import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
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
  } else {
    console.log("SMTP connection successful! Ready to send emails.");
  }
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

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
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    const isValid = true;

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.login(email, password);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: (user as any)._id,
        email: user.email,
        role: (user as any).role || 'customer'
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '15m'
      }
    );

    const userData = {
      id: (user as any)._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: (user as any).role || 'user',
      createdAt: (user as any).createdAt,
      status: (user as any).status
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

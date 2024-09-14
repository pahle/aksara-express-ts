import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { error } from "console";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendOtpToEmail = async (
  email: string,
  otp: string
) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
      // TODO Add email template for better user experience
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error("Error in mailer " + error.message);
  }
};

import dotenv from 'dotenv';
dotenv.config();

import Otp from "../models/Otp.js";
import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

const SENDER_EMAIL = process.env.EMAIL_USER || 'ai.amritschool@gmail.com';
const SENDER_NAME = "Amrit's School";

// ------------------------
export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ------------------------
export const sendOtp = async (email) => {
  console.log("📧 Sending OTP to:", email, "via Brevo");

  if (!email || email.trim() === "") {
    throw new Error("❌ Email not provided for OTP");
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await Otp.create({ email, otp, expiresAt });

  const sendSmtpEmail = {
    sender: { email: SENDER_EMAIL, name: SENDER_NAME },
    to: [{ email }],
    subject: "Amrit's School Email Verification OTP 🔒",
    htmlContent: `
      <p>Your OTP is <strong>${otp}</strong>.</p>
      <p>It will expire in <strong>10 minutes</strong>.</p>
      <p>Do not share this code with anyone.</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ OTP sent successfully to:", email);
    return otp;
  } catch (error) {
    console.error(
      "❌ Error sending email with Brevo:",
      error.response?.body || error.message
    );
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// ------------------------
export const verifyOtp = async (email, otp) => {
  const record = await Otp.findOne({ email, otp });
  if (!record) return false;
  if (record.expiresAt < Date.now()) return false;

  await Otp.deleteMany({ email });
  return true;
};

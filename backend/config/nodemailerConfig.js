import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @file nodemailerConfig.js (BACKEND)
 * @description This is the updated configuration.
 * Instead of using the "service: 'gmail'" shortcut, we are explicitly
 * defining the host, port, and secure connection. This is the most
 * reliable way to configure Nodemailer for deployment.
 */
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // true for port 465, false for other ports like 587
    auth: {
        user: process.env.EMAIL_USER, // Your full email: ai.amritschool@gmail.com
        pass: process.env.EMAIL_PASS  // Your 16-digit Google App Password
    }
});

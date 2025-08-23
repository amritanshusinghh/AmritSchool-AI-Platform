import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtp, verifyOtp } from "../services/otpService.js";

// --- START: New Feature ---
// List of allowed email domains to prevent temporary email services
const allowedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'aol.com',
    'protonmail.com'
    // You can add more trusted domains here
];
// --- END: New Feature ---

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("✅ Received register request:", email);

        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "❌ Invalid or missing email address" });
        }
        
        // --- START: New Feature ---
        // Extract the domain from the email to validate it
        const domain = email.substring(email.lastIndexOf("@") + 1);

        // Check if the domain is in the allowed list
        if (!allowedDomains.includes(domain.toLowerCase())) {
            return res.status(400).json({ 
                message: "❌ Popular email providers only." 
            });
        }
        // --- END: New Feature ---

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        await sendOtp(email);

        res.status(201).json({ message: "✅ Registered successfully. OTP sent to your email." });
    } catch (error) {
        console.error("❌ Registration error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const isValid = await verifyOtp(email, otp);
        if (!isValid) return res.status(400).json({ message: "Invalid or expired OTP" });

        await User.findOneAndUpdate({ email }, { isVerified: true });
        res.json({ message: "Email Verified Successfully" });
    } catch (error) {
        console.error("Verification error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        if (!user.isVerified) return res.status(403).json({ message: " Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
 
        
        res.json({ token, message: "✅ Login Successful" });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get the currently authenticated user's profile
export const getMe = async (req, res) => {
    try {
        // req.user.id is attached by the 'authenticate' middleware
        const user = await User.findById(req.user.id).select('name');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user profile:", error.message);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UnverifiedUser from "../models/UnverifiedUser.js"; // Import the new model
import { sendOtp, verifyOtp } from "../services/otpService.js";

const allowedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'aol.com',
    'protonmail.com'
];

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "Invalid or missing email address" });
        }
        
        const domain = email.substring(email.lastIndexOf("@") + 1);
        if (!allowedDomains.includes(domain.toLowerCase())) {
            return res.status(400).json({ message: "Popular email providers only." });
        }

        // --- START: New Registration Logic ---
        // Check if a verified user with this email already exists
        const verifiedUser = await User.findOne({ email });
        if (verifiedUser) {
            return res.status(409).json({ message: "This email is already registered and verified. Please log in." });
        }

        // Remove any previous unverified attempts with the same email
        await UnverifiedUser.deleteOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a record in the UnverifiedUser collection
        await UnverifiedUser.create({ name, email, password: hashedPassword });

        await sendOtp(email);
        res.status(201).json({ message: "Registered successfully. An OTP has been sent to your email." });
        // --- END: New Registration Logic ---

    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: "An internal server error occurred. Please try again later." });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const isValid = await verifyOtp(email, otp);
        if (!isValid) return res.status(400).json({ message: "Invalid or expired OTP" });

        // --- START: New Verification Logic ---
        // Find the user in the UnverifiedUser collection
        const unverifiedUser = await UnverifiedUser.findOne({ email });
        if (!unverifiedUser) {
            return res.status(404).json({ message: "Verification failed. Please register again." });
        }

        // Move user from unverified to the main User collection
        await User.create({
            name: unverifiedUser.name,
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            isVerified: true
        });

        // Clean up the unverified user record
        await UnverifiedUser.deleteOne({ email });
        
        res.json({ message: "Email Verified Successfully" });
        // --- END: New Verification Logic ---

    } catch (error) {
        console.error("Verification error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// ... (login and getMe functions remain the same)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        if (!user.isVerified) return res.status(403).json({ message: " Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token, message: " Login Successful" });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};
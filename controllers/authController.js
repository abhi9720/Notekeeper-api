const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailSender = require('../services/EmailSender');

// Register a new user
const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ email });

        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        const newUser = new User({ username, password, email });

        await newUser.save();

        const token = generateToken(newUser);
        const data = {
            username: username,
            loginUrl: process.env.frontendURL
        }
        new EmailSender().sendEmail(email, `Welcome to NotewisePro`, 'welcome_email_template', data)
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to register user.' });
    }
};

// Login and generate a JWT token
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = generateToken(user);

        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to log in.' });
    }
};

// Helper function to generate a JWT token
const generateToken = (user) => {
    console.log(process.env.secret, process.env.tokenExpiration);
    return jwt.sign({ id: user.id, email: user.email }, process.env.secret, {
        expiresIn: process.env.tokenExpiration,
    });
};

module.exports = { register, login };

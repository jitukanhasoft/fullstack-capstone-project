const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            logger.error('Registration failed: Missing fields');
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            logger.error('Registration failed: User already exists');
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Save user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        const result = await collection.insertOne(newUser);

        // Generate token
        const payload = {
            user: {
                id: result.insertedId,
                email: newUser.email
            }
        };
        const authtoken = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        logger.info('User registered successfully');
        return res.status(201).json({ authtoken, email: newUser.email, name: newUser.name });
    } catch (e) {
        logger.error(`Error in registration: ${e.message}`);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.error('Login failed: Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Find user
        const user = await collection.findOne({ email });
        if (!user) {
            logger.error('Login failed: User not found');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            logger.error('Login failed: Incorrect password');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        };
        const authtoken = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        logger.info('User logged in successfully');
        return res.status(200).json({ authtoken, email: user.email, name: user.name });
    } catch (e) {
        logger.error(`Error in login: ${e.message}`);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.put('/update', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const emailHeader = req.headers.email;

        if (!authHeader || !emailHeader) {
            return res.status(400).json({ error: 'Authorization token and email are required headers' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        if (decoded.user.email !== emailHeader) {
            return res.status(401).json({ error: 'Token is not valid for the requested user' });
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Update user
        const result = await collection.updateOne(
            { email: emailHeader },
            { $set: { name } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        logger.info('User profile updated successfully');
        return res.status(200).json({ message: 'Profile updated successfully', name });
    } catch (e) {
        logger.error(`Error in profile update: ${e.message}`);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

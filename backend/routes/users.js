const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // הוספת פרטי המשתמש המבוססים על הטוקן
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// רישום משתמש חדש
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // בדיקה אם המייל כבר קיים
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(password, 10);

        // יצירת משתמש חדש
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in signup:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// התחברות משתמש
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Failed to log in' });
    }
});


router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // מחזירים את פרטי המשתמש ללא הסיסמה
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    try {
        const { name, password } = req.body;

        const updatedData = {};
        if (name) updatedData.name = name;
        if (password) updatedData.password = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(req.user.userId, updatedData, { new: true }).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;

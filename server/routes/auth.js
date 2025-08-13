const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashed = bcrypt.hashSync(password, 8);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
        if (err) return res.status(500).json({ msg: 'Error registering' });
        res.json({ msg: 'User registered' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ msg: 'Error logging in' });
        if (results.length === 0) return res.status(400).json({ msg: 'User not found' });

        const user = results[0];
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.status(401).json({ msg: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;

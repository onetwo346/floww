const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { send2FACode } = require('../../lib/email');

const router = express.Router();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

router.post('/login', async (req, res) => {
    const { email, password, remember } = req.body;

    try {
        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate new 2FA code
        const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
        
        // Save 2FA code
        await pool.query(
            'UPDATE users SET verification_code = $1 WHERE id = $2',
            [twoFactorCode, user.id]
        );

        // Send 2FA code via email
        await send2FACode(email, twoFactorCode);

        // Generate temporary JWT for 2FA
        const tempToken = jwt.sign(
            { 
                userId: user.id,
                requires2FA: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        res.json({
            message: '2FA code sent to your email',
            token: tempToken,
            requires2FA: true
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;

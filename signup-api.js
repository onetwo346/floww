const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { sendWelcomeEmail } = require('../../lib/email');

const router = express.Router();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, type, companyName, website } = req.body;

    try {
        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 2FA code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (
                email, 
                password, 
                type, 
                company_name, 
                website, 
                verification_code,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
            [email, hashedPassword, type, companyName, website, verificationCode]
        );

        const user = result.rows[0];

        // Send welcome email with verification code
        await sendWelcomeEmail(email, verificationCode);

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Account created successfully',
            token,
            requiresVerification: true
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const router = express.Router();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

router.post('/verify-2fa', async (req, res) => {
    const { code, token, walletAddress } = req.body;

    try {
        // Verify temp token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.requires2FA) {
            return res.status(400).json({ message: 'Invalid token type' });
        }

        // Get user
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        // Verify code
        if (user.verification_code !== code) {
            return res.status(401).json({ message: 'Invalid verification code' });
        }

        // Clear verification code
        await pool.query(
            'UPDATE users SET verification_code = NULL WHERE id = $1',
            [user.id]
        );

        // If wallet address provided, bind it
        if (walletAddress) {
            await pool.query(
                'UPDATE users SET wallet_address = $1 WHERE id = $2',
                [walletAddress, user.id]
            );
        }

        // Generate full access token
        const accessToken = jwt.sign(
            { 
                userId: user.id,
                type: user.type,
                verified: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Verification successful',
            token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                type: user.type,
                walletAddress: walletAddress || user.wallet_address
            }
        });

    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
});

module.exports = router;

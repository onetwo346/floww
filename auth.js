// Combined authentication handler for Floww
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user storage (replace with database in production)
const users = [];

// Email sending function (simplified)
const sendEmail = (to, subject, html) => {
  console.log(`Email sent to ${to}: ${subject}`);
  // In production, integrate with SendGrid or similar service
};

// SIGNUP ENDPOINT
router.post('/api/signup', async (req, res) => {
  try {
    const { email, password, type, companyName, website } = req.body;
    
    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      type,
      companyName,
      website,
      verificationCode,
      verified: false,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Send welcome email
    sendEmail(
      email,
      'Welcome to Floww - Verify Your Account',
      `Your verification code is: ${verificationCode}`
    );
    
    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'floww-secret-key',
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

// LOGIN ENDPOINT
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate new 2FA code
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = twoFactorCode;
    
    // Send 2FA code
    sendEmail(
      email,
      'Floww - Your 2FA Code',
      `Your 2FA code is: ${twoFactorCode}`
    );
    
    // Generate temporary JWT
    const token = jwt.sign(
      { userId: user.id, requires2FA: true },
      process.env.JWT_SECRET || 'floww-secret-key',
      { expiresIn: '5m' }
    );
    
    res.json({
      message: '2FA code sent to your email',
      token,
      requires2FA: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// VERIFY 2FA ENDPOINT
router.post('/api/verify-2fa', async (req, res) => {
  try {
    const { code, token, walletAddress } = req.body;
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'floww-secret-key');
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (!decoded.requires2FA) {
      return res.status(400).json({ message: 'Invalid token type' });
    }
    
    // Find user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify code
    if (user.verificationCode !== code) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }
    
    // Clear verification code
    user.verificationCode = null;
    user.verified = true;
    
    // Update wallet if provided
    if (walletAddress) {
      user.walletAddress = walletAddress;
    }
    
    // Generate full access token
    const accessToken = jwt.sign(
      { userId: user.id, type: user.type, verified: true },
      process.env.JWT_SECRET || 'floww-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Verification successful',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        walletAddress: walletAddress || user.walletAddress
      }
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

module.exports = router;

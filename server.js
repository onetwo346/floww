require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Auth routes
app.use('/', require('./auth.js'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Auth pages
app.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Main pages
app.get('/buysell(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'buysell.html'));
});

app.get('/business(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'business.html'));
});

app.get('/about(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/account(.html)?', (req, res) => {
    // In a real app, we would verify the JWT token here
    res.sendFile(path.join(__dirname, 'account.html'));
});

// 404 handler - must be last
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// API endpoint to get crypto rates
app.get('/api/rates', (req, res) => {
    // In a real app, fetch from CoinGecko or similar
    res.json({
        BTC: 69420.50,
        ETH: 3876.25,
        SOL: 142.33,
        DOGE: 0.12
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

# Floww - Global Crypto Brokerage Platform

A professional crypto brokerage platform with real authentication, wallet integration, live crypto rates, and a clean UI design.

## Features

- 🔒 Secure Authentication with 2FA
- 💱 Real-time Crypto Rates
- 👛 Wallet Integration
- 💳 Multiple Payment Processors
- 🏢 Business Account Support
- 📱 Responsive Design
- 🌐 Global Coverage
- ⚡ Smart Processor Routing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- SendGrid Account (for emails)
- Crypto Payment Processor Accounts

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/floww.git
   cd floww
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE floww;
   CREATE USER floww WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE floww TO floww;
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

5. Set up the database schema:
   ```bash
   npm run setup-db
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `SENDGRID_API_KEY`: SendGrid API key for emails
- `PORT`: Server port (default: 3000)
- See `.env` file for all configuration options

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Create new account
- `POST /api/auth/login`: Login to account
- `POST /api/auth/verify-2fa`: Verify 2FA code

### Transactions
- `POST /api/transactions/create`: Create new transaction
- `GET /api/transactions/list`: List user transactions
- `GET /api/transactions/:id`: Get transaction details

### Business Features
- `POST /api/business/api-keys`: Generate API keys
- `POST /api/business/webhooks`: Configure webhooks
- `POST /api/business/kyc`: Submit KYC information

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Two-factor authentication
- Rate limiting
- SQL injection protection
- XSS protection
- CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

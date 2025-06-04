const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Welcome email with verification code
const sendWelcomeEmail = async (email, code) => {
    const msg = {
        to: email,
        from: 'noreply@floww.com',
        subject: 'Welcome to Floww - Verify Your Account',
        html: `
            <div style="background: linear-gradient(to bottom, #1a1a2e, #000); color: white; padding: 2rem; border-radius: 1rem;">
                <h1 style="color: #3b82f6; margin-bottom: 2rem;">Welcome to Floww!</h1>
                
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
                    You're just one step away from accessing the future of crypto brokerage.
                </p>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0;">
                    <h2 style="color: #3b82f6; margin-bottom: 1rem;">Your Verification Code</h2>
                    <div style="font-size: 2rem; letter-spacing: 0.5rem; color: #3b82f6;">${code}</div>
                </div>

                <p style="color: #9ca3af; margin-top: 2rem;">
                    This code will expire in 5 minutes for security purposes.
                </p>

                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(156, 163, 175, 0.2);">
                    <p style="color: #9ca3af; font-size: 0.9rem;">
                        If you didn't create an account with Floww, please ignore this email.
                    </p>
                </div>
            </div>
        `
    };

    await sgMail.send(msg);
};

// 2FA verification code
const send2FACode = async (email, code) => {
    const msg = {
        to: email,
        from: 'noreply@floww.com',
        subject: 'Floww - Your 2FA Code',
        html: `
            <div style="background: linear-gradient(to bottom, #1a1a2e, #000); color: white; padding: 2rem; border-radius: 1rem;">
                <h1 style="color: #3b82f6; margin-bottom: 2rem;">Verify Your Login</h1>
                
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0;">
                    <h2 style="color: #3b82f6; margin-bottom: 1rem;">Your 2FA Code</h2>
                    <div style="font-size: 2rem; letter-spacing: 0.5rem; color: #3b82f6;">${code}</div>
                </div>

                <p style="color: #9ca3af; margin-top: 2rem;">
                    This code will expire in 5 minutes for security purposes.
                </p>

                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(156, 163, 175, 0.2);">
                    <p style="color: #9ca3af; font-size: 0.9rem;">
                        If you didn't attempt to log in to Floww, please change your password immediately.
                    </p>
                </div>
            </div>
        `
    };

    await sgMail.send(msg);
};

// Password reset email
const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `https://floww.com/auth/reset-password?token=${token}`;

    const msg = {
        to: email,
        from: 'noreply@floww.com',
        subject: 'Floww - Reset Your Password',
        html: `
            <div style="background: linear-gradient(to bottom, #1a1a2e, #000); color: white; padding: 2rem; border-radius: 1rem;">
                <h1 style="color: #3b82f6; margin-bottom: 2rem;">Reset Your Password</h1>
                
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
                    Click the button below to reset your password:
                </p>

                <a href="${resetUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; margin: 2rem 0;">
                    Reset Password
                </a>

                <p style="color: #9ca3af; margin-top: 2rem;">
                    This link will expire in 1 hour for security purposes.
                </p>

                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(156, 163, 175, 0.2);">
                    <p style="color: #9ca3af; font-size: 0.9rem;">
                        If you didn't request a password reset, please ignore this email.
                    </p>
                </div>
            </div>
        `
    };

    await sgMail.send(msg);
};

module.exports = {
    sendWelcomeEmail,
    send2FACode,
    sendPasswordResetEmail
};

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendPasswordResetEmail({ email, name, resetUrl }) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    if (env.NODE_ENV !== 'production') console.log(`Password reset URL for ${email}: ${resetUrl}`);
    return false;
  }
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
  });
  await transport.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: 'Reset your Natraj account password',
    text: `Hello ${name},\n\nReset your password using this link: ${resetUrl}\n\nThis link expires in 30 minutes. If you did not request this, ignore this email.`
  });
  return true;
}

import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, url: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error('Password recovery email is not configured. Set the SMTP_* environment variables.');
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transport.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: 'Reset your Salem Africa staff password',
    text: `Use this link to set or reset your Salem Africa staff password:\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Use this link to set or reset your Salem Africa staff password:</p><p><a href="${url}">Set your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
}

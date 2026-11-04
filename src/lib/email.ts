import nodemailer from 'nodemailer';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error('Email delivery is not configured. Set the SMTP_* environment variables.');
  }
  return {
    from: SMTP_FROM,
    transport: nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    }),
  };
}

export async function sendPasswordResetEmail(email: string, url: string) {
  const { from, transport } = getTransport();

  await transport.sendMail({
    from,
    to: email,
    subject: 'Reset your Salem Africa staff password',
    text: `Use this link to set or reset your Salem Africa staff password:\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Use this link to set or reset your Salem Africa staff password:</p><p><a href="${url}">Set your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
}

export async function sendStaffInvitationEmail(email: string, url: string) {
  const { from, transport } = getTransport();
  const safeUrl = escapeHtml(url);

  await transport.sendMail({
    from,
    to: email,
    subject: 'Your Salem Africa staff invitation',
    text: `You have been invited to join the Salem Africa staff dashboard. Open this secure link to accept your invitation and create your password:\n\n${url}\n\nThis link expires in 48 hours and can only be used once. If you did not expect this invitation, you can ignore this email.`,
    html: `<p>You have been invited to join the Salem Africa staff dashboard.</p><p><a href="${safeUrl}">Accept invitation and create your password</a></p><p>This link expires in 48 hours and can only be used once. If you did not expect this invitation, you can ignore this email.</p>`,
  });
}

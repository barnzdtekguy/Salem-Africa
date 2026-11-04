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
  const requiredVariables: Array<[string, string | undefined]> = [
    ['SMTP_HOST', SMTP_HOST],
    ['SMTP_PORT', SMTP_PORT],
    ['SMTP_USER', SMTP_USER],
    ['SMTP_PASSWORD', SMTP_PASSWORD],
    ['SMTP_FROM', SMTP_FROM],
  ];
  const missing = requiredVariables
    .filter(([name, value]) => name === 'SMTP_PASSWORD' ? !value : !value?.trim())
    .map(([name]) => name);
  if (missing.length) {
    throw new Error(`Email delivery is not configured. Missing environment variables: ${missing.join(', ')}.`);
  }

  const host = SMTP_HOST?.trim();
  const portText = SMTP_PORT?.trim();
  const user = SMTP_USER?.trim();
  const from = SMTP_FROM?.trim();
  if (!host || !portText || !user || !from || !SMTP_PASSWORD) {
    throw new Error('Email delivery configuration contains an empty required value.');
  }
  if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) {
    throw new Error('SMTP_PORT must be a valid TCP port number.');
  }
  const port = Number(portText);

  return {
    from,
    transport: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user, pass: SMTP_PASSWORD },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    }),
  };
}

async function sendToRecipient(
  transport: ReturnType<typeof nodemailer.createTransport>,
  options: Parameters<typeof transport.sendMail>[0],
  recipient: string,
) {
  const info = await transport.sendMail(options);
  const recipientAccepted = info.accepted.some(
    (accepted: string) => accepted.toLowerCase() === recipient.trim().toLowerCase(),
  );
  if (!recipientAccepted || info.rejected.length > 0) {
    const error = new Error('The SMTP server did not accept the recipient.');
    Object.assign(error, { code: 'EENVELOPE', response: info.response });
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, url: string) {
  const { from, transport } = getTransport();

  await sendToRecipient(transport, {
    from,
    to: email,
    subject: 'Reset your Salem Africa staff password',
    text: `Use this link to set or reset your Salem Africa staff password:\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Use this link to set or reset your Salem Africa staff password:</p><p><a href="${url}">Set your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  }, email);
}

export async function sendStaffInvitationEmail(email: string, url: string) {
  const { from, transport } = getTransport();
  const safeUrl = escapeHtml(url);

  await sendToRecipient(transport, {
    from,
    to: email,
    subject: 'Your Salem Africa staff invitation',
    text: `You have been invited to join the Salem Africa staff dashboard. Open this secure link to accept your invitation and create your password:\n\n${url}\n\nThis link expires in 48 hours and can only be used once. If you did not expect this invitation, you can ignore this email.`,
    html: `<p>You have been invited to join the Salem Africa staff dashboard.</p><p><a href="${safeUrl}">Accept invitation and create your password</a></p><p>This link expires in 48 hours and can only be used once. If you did not expect this invitation, you can ignore this email.</p>`,
  }, email);
}

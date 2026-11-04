import 'server-only';

function redactDiagnosticText(value: string) {
  return value
    .replace(/\b(?:mysql|mariadb|https?):\/\/[^\s"'<>]+/gi, '[REDACTED_URL]')
    .replace(/access denied for user\s+.+?(?=\s+\(using password:)/gi, 'Access denied for user [REDACTED]')
    .replace(/\(using password:[^)\r\n]*\)?/gi, '(using password: [REDACTED])')
    .replace(/((?:password|passwd|secret|token|authorization|cookie|connection(?:string)?|database_url|smtp_password)\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi, '$1[REDACTED]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, '[REDACTED_ID]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[REDACTED_IP]')
    .replace(/(C:\\Users\\)[^\\]+/gi, '$1[REDACTED]')
    .replace(/(\/home\/)[^/\s]+/g, '$1[REDACTED]')
    .replace(/\b[A-Za-z0-9_-]{40,}\b/g, '[REDACTED_TOKEN]');
}

function diagnosticFields(error: unknown) {
  if (!(error instanceof Error)) {
    return { name: 'UnknownError', message: redactDiagnosticText(String(error)).slice(0, 2000) };
  }

  const detail = error as Error & {
    code?: unknown;
    errno?: unknown;
    sqlState?: unknown;
  };
  return {
    name: redactDiagnosticText(detail.name),
    message: redactDiagnosticText(detail.message).slice(0, 2000),
    ...(typeof detail.code === 'string' || typeof detail.code === 'number' ? { code: detail.code } : {}),
    ...(typeof detail.errno === 'string' || typeof detail.errno === 'number' ? { errno: detail.errno } : {}),
    ...(typeof detail.sqlState === 'string' ? { sqlState: detail.sqlState } : {}),
    ...(detail.stack ? { stack: redactDiagnosticText(detail.stack).slice(0, 8000) } : {}),
  };
}

export function logServerError(event: string, error: unknown) {
  console.error(JSON.stringify({ event, error: diagnosticFields(error) }));
}

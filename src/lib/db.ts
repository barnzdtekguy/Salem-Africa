import { createPool, type Pool } from 'mysql2/promise';

let pool: Pool | undefined;

function getConnectionOptions() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DATABASE_URL } = process.env;
  if (DB_HOST && DB_NAME && DB_USER && DB_PASSWORD) {
    return {
      host: DB_HOST,
      port: Number(DB_PORT || 3306),
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    };
  }

  if (!DATABASE_URL) {
    throw new Error('Database is not configured. Set Hostinger DB_* variables or DATABASE_URL.');
  }
  const url = new URL(DATABASE_URL);
  if (!['mysql:', 'mariadb:'].includes(url.protocol)) {
    throw new Error('DATABASE_URL must use the mysql:// or mariadb:// protocol.');
  }

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    database: decodeURIComponent(url.pathname.slice(1)),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
  };
}

export function getDatabase() {
  if (!pool) {
    pool = createPool({
      ...getConnectionOptions(),
      timezone: 'Z',
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
    });
  }
  return pool;
}

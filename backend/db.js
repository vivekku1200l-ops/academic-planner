const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. For local development, set it to a PostgreSQL connection string.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      deadline DATE NOT NULL,
      effort DOUBLE PRECISION NOT NULL,
      priority TEXT NOT NULL,
      remaining DOUBLE PRECISION NOT NULL,
      completed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS availability (
      id INTEGER PRIMARY KEY CHECK (id=1),
      hours_per_day DOUBLE PRECISION DEFAULT 2
    );

    INSERT INTO availability (id, hours_per_day)
    VALUES (1, 2)
    ON CONFLICT (id) DO NOTHING;
  `);
}

module.exports = { pool, initDb };

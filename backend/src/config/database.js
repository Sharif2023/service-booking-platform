const { Pool } = require('pg');
require('dotenv').config();

const config = {
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'booking_platform',
};

// Add SSL for production/Supabase
if (process.env.DATABASE_URL || process.env.NODE_ENV === 'production') {
  config.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;

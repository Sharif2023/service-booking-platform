const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, full_name, phone, role = 'user', verification_token = null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, phone, role, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name, phone, role, is_verified, created_at',
      [email, hashedPassword, full_name, phone, role, verification_token]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findByToken(token) {
    const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);
    return result.rows[0];
  }

  static async verifyEmail(id) {
    await pool.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1', [id]);
  }
}

module.exports = User;

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, full_name, phone, role = 'user', verification_token = null, gender = null, dob = null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, phone, role, verification_token, gender, dob) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [email, hashedPassword, full_name, phone, role, verification_token, gender, dob]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, email, full_name, phone, role, gender, dob, created_at FROM users WHERE id = $1', [id]);
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

  static async update(id, { full_name, phone, password, gender, dob }) {
    // Defensive handling for empty/null values
    const safeDob = (dob && dob !== '') ? dob : null;
    const safeGender = (gender && gender !== '') ? gender : null;

    let query = 'UPDATE users SET full_name = $1, phone = $2, gender = $3, dob = $4';
    const params = [full_name, phone, safeGender, safeDob, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password_hash = $6';
      params.push(hashedPassword);
    }

    query += ', updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *';
    
    const result = await pool.query(query, params);
    return result.rows[0];
  }
}

module.exports = User;

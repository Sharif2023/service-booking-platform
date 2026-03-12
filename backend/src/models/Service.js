const pool = require('../config/database');

class Service {
  static async getAll() {
    const result = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(name, description, price, duration_minutes, category, image_url) {
    const result = await pool.query(
      'INSERT INTO services (name, description, price, duration_minutes, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, duration_minutes, category, image_url]
    );
    return result.rows[0];
  }

  static async update(id, name, description, price, duration_minutes, category, image_url) {
    const result = await pool.query(
      'UPDATE services SET name=$1, description=$2, price=$3, duration_minutes=$4, category=$5, image_url=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
      [name, description, price, duration_minutes, category, image_url, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
  }
}

module.exports = Service;

const pool = require('../config/database');

class Booking {
  static async create(user_id, service_id, booking_date, booking_time, special_requests) {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, service_id, booking_date, booking_time, special_requests) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, service_id, booking_date, booking_time, special_requests]
    );
    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByUserId(user_id) {
    const result = await pool.query(
      `SELECT b.*, s.name as service_name, s.price as service_price, s.image_url 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE b.user_id = $1 
       ORDER BY b.booking_date DESC`,
      [user_id]
    );
    return result.rows;
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT b.*, u.full_name as user_name, u.email, s.name as service_name, s.price as service_price 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       JOIN services s ON b.service_id = s.id 
       ORDER BY b.booking_date DESC`
    );
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async updateStripeSession(id, stripe_session_id, stripe_payment_id) {
    const result = await pool.query(
      'UPDATE bookings SET stripe_session_id = $1, stripe_payment_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [stripe_session_id, stripe_payment_id, id]
    );
    return result.rows[0];
  }

  static async getByStripeSessionId(session_id) {
    const result = await pool.query('SELECT * FROM bookings WHERE stripe_session_id = $1', [session_id]);
    return result.rows[0];
  }
}

module.exports = Booking;

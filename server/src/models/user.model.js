var { pool } = require('../config/db');

var userModel = {
  async findByEmail(email) {
    var result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    var result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createUser(email, name, passwordHash, role = 'admin') {
    var query = `
      INSERT INTO users (email, name, role, "passwordHash")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    var result = await pool.query(query, [email, name, role, passwordHash]);
    return result.rows[0];
  }
};

module.exports = { userModel };

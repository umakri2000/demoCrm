var { pool } = require('../config/db');

var customerModel = {
  async createCustomer(data) {
    var { name, company, email, phone, source, status, notes } = data;
    var query = `
      INSERT INTO customers (name, company, email, phone, source, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    var result = await pool.query(query, [name, company, email, phone, source, status || 'New', notes]);
    return result.rows[0];
  },

  async getAllCustomers() {
    var query = `SELECT * FROM customers ORDER BY created_at DESC`;
    var result = await pool.query(query);
    return result.rows;
  },

  async updateCustomer(id, data) {
    var { name, company, email, phone, source, status, notes } = data;
    var query = `
      UPDATE customers 
      SET name = $1, company = $2, email = $3, phone = $4, source = $5, status = $6, notes = $7
      WHERE id = $8
      RETURNING *
    `;
    var result = await pool.query(query, [name, company, email, phone, source, status, notes, id]);
    return result.rows[0];
  },

  async deleteCustomer(id) {
    var query = `DELETE FROM customers WHERE id = $1 RETURNING *`;
    var result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};

module.exports = { customerModel };

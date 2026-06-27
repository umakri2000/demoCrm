var { pool } = require('../config/db');

var contactModel = {
  async createContact(data) {
    var { name, company, email, phone, source, status, notes } = data;
    var query = `
      INSERT INTO contacts (name, company, email, phone, source, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    var result = await pool.query(query, [name, company, email, phone, source, status, notes]);
    return result.rows[0];
  }
};

module.exports = { contactModel };

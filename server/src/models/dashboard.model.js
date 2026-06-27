var { pool } = require('../config/db');

var dashboardModel = {
  async getSummary() {
    var query = `
      SELECT 
        COUNT(*) as "totalLeads",
        COUNT(*) FILTER (WHERE status = 'New') as "new",
        COUNT(*) FILTER (WHERE status = 'Contacted') as "contacted",
        COUNT(*) FILTER (WHERE status = 'Qualified') as "qualified",
        COUNT(*) FILTER (WHERE status = 'Won') as "won",
        COUNT(*) FILTER (WHERE status = 'Lost') as "lost"
      FROM customers
    `;
    var result = await pool.query(query);
    var row = result.rows[0];

    // Parse strings to integers (PostgreSQL COUNT returns bigint which pg parses as string)
    return {
      totalLeads: parseInt(row.totalLeads, 10),
      new: parseInt(row.new, 10),
      contacted: parseInt(row.contacted, 10),
      qualified: parseInt(row.qualified, 10),
      won: parseInt(row.won, 10),
      lost: parseInt(row.lost, 10)
    };
  }
};

module.exports = { dashboardModel };

var { dashboardModel } = require('../models/dashboard.model');

var dashboardController = {
  async getSummary(req, res) {
    try {
      var summary = await dashboardModel.getSummary();
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = { dashboardController };

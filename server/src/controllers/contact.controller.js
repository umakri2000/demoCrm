var { contactModel } = require('../models/contact.model');

var contactController = {
  async createContact(req, res) {
    try {
      var { name, company, email, phone, source, status, notes } = req.body;

      if (!name || !company || !email || !phone || !source || !status) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      var contact = await contactModel.createContact({ name, company, email, phone, source, status, notes });
      res.status(201).json({ message: 'Contact submitted successfully', contact });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = { contactController };

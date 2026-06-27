var { customerModel } = require('../models/customer.model');

var customerController = {
  async createCustomer(req, res) {
    try {
      var { name, company, email, phone, source, status, notes } = req.body;

      // Validation
      if (!name || !company || !email || !phone || !source) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      var customer = await customerModel.createCustomer({ name, company, email, phone, source, status, notes });
      res.status(201).json({ message: 'Customer submitted successfully', customer });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAllCustomers(req, res) {
    try {
      var customers = await customerModel.getAllCustomers();
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateCustomer(req, res) {
    try {
      var { id } = req.params;
      var { name, company, email, phone, source, status, notes } = req.body;

      if (!name || !company || !email || !phone || !source || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      var updatedCustomer = await customerModel.updateCustomer(id, { name, company, email, phone, source, status, notes });

      if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteCustomer(req, res) {
    try {
      var { id } = req.params;
      var deleted = await customerModel.deleteCustomer(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = { customerController };

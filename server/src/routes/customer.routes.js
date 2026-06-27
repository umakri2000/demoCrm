var { Router } = require('express');
var { customerController } = require('../controllers/customer.controller');
var { authMiddleware } = require('../middleware/auth.middleware');

var router = Router();

// Public route for submitting contact form -> mapped to customersdata in index.js
router.post('/', customerController.createCustomer);

// Protected routes
router.get('/', authMiddleware, customerController.getAllCustomers);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;

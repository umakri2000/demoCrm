var { Router } = require('express');
var { dashboardController } = require('../controllers/dashboard.controller');
var { authMiddleware } = require('../middleware/auth.middleware');

var router = Router();

router.get('/summary', authMiddleware, dashboardController.getSummary);

module.exports = router;

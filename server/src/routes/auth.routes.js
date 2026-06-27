var { Router } = require('express');
var { authController } = require('../controllers/auth.controller');
var { authMiddleware } = require('../middleware/auth.middleware');

var router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);

module.exports = router;

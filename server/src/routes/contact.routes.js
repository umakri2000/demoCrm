var { Router } = require('express');
var { contactController } = require('../controllers/contact.controller');

var router = Router();

router.post('/', contactController.createContact);

module.exports = router;

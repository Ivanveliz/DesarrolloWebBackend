const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.renderLoginForm);
router.post('/', loginController.processLogin);

module.exports = router;

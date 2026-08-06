const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  renderLogin,
  renderRegister,
  register,
  login,
  logout,
  me,
} = require('../controllers/authController');

const router = express.Router();

router.get('/login', renderLogin);
router.get('/cadastro', renderRegister);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;

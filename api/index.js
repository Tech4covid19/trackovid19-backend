const { Router } = require('express');
const router = Router();

// API routes
router.use('/user', require('./user'));

module.exports = router;

const { Router } = require('express');
const router = Router();

// API routes
router.use('/user', require('./user'));

router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Hello world!' });
});


module.exports = router;

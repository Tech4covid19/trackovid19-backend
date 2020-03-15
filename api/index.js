const { Router } = require('express');
const router = Router();

// API routes
if (process.env.MOCK_SERVICES === "true") {
    router.use('/user', require('./mocks/user'));
    router.use('/case', require('./mocks/case'));
}
else {
    router.use('/user', require('./user'));
    router.use('/case', require('./case'));
}

module.exports = router;

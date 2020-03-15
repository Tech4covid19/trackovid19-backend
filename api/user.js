const { Router } = require('express');
const router = Router();
const Users = require('../services/users');

router.get('/', (req, res) => {
    res.status(200).json(req.user);
});


/**
 * Creates a new user
 *  
 */
router.post('/', async (req, res) => {
    const user = await Users.create({});
    res.status(200).json(user);
});

module.exports = router;

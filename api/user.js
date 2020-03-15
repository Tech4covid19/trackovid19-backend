const { Router } = require('express');
const router = Router();
// const Users = require('../services/users');

router.get('/', (req, res) => {
    res.status(200).json(req.user);
});


/**
 * Creates a new user
 *
 */
// router.post('/', async (req, res) => {
//     try {
//         const user = await Users.create({ pw: 'teste123', age: 28, city: 'Felgueiras', ip: req.ip, info: { bla: 'bla' } });
//         res.status(200).json(user);
//     } catch (error) {
//         console.log('------------------------------------');
//         console.log(error);
//         console.log('------------------------------------');
//         res.status(500).json(error);
//     }
// });

module.exports = router;

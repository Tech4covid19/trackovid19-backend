const { Router } = require('express');
const router = Router();

let mock = {
    id: 123,
    fbId: "qwertyuiop",
    postalCode: "4200-182",
    geo: {
        lat: 0,
        lon: 0
    },
    condition: "symptomatic",
    timestamp: "2012-04-23T18:25:43.511Z"
};

router.get('/', (req, res) => {
    res.status(200).json([mock]);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (id != 123) {
        res.status(404).json({error: "error.not_found"})
    }
    else {
        res.status(200).json(mock);
    }
});

router.post('/', (req, res) => {
    data = req.body;
    data.id = 123
    res.status(201).json(data);
});

module.exports = router;

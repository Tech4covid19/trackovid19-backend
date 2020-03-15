const { Router } = require('express');
const router = Router();

let mock = {
    id: 999,
    fbId: "qwertyuiop",
    cases: [{
        id: 123,
        fbId: "qwertyuiop",
        postalCode: "4200-182",
        geo: {
            lat: 0,
            lon: 0
        },
        condition: "symptomatic",
        timestamp: "2012-04-23T18:25:43.511Z"
    }],
    network: {
        direct: [
            {
                condition: "infected",
                value: 10
            },
            {
                condition: "quarentine",
                value: 20
            },
            {
                condition: "symptomatic",
                value: 30
            },
            {
                condition: "recovered",
                value: 40
            },
            {
                condition: "normal",
                value: 50
            }

        ],
        indirect: [
            {
                condition: "infected",
                value: 10
            },
            {
                condition: "quarentine",
                value: 20
            },
            {
                condition: "symptomatic",
                value: 30
            },
            {
                condition: "recovered",
                value: 40
            },
            {
                condition: "normal",
                value: 50
            }
        ]
    }
};

router.get('/', (req, res) => {
    res.status(200).json(mock);
});

module.exports = router;
'use strict'

const table = require('../db/table')('users');

class Users {
    constructor() {
        // TODO
    }

    static create(user) {

        return table.insert({
            id: '1234567891234561',
            hash: '324c2342523v5235',
            age: 28,
            city: 'Felgueiras',
            ip: '127.0.0.1',
            info: 'blablalbla',
            timestamp: Date.now()
        })
    }
}

module.exports = Users;
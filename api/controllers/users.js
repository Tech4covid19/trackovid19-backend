'use strict'
const bcrypt = require('bcrypt');
const random = require('../../utils/random');
const table = require('../../db/table')('users');

class Users {
    static async create({ id = random.makeid(16), pw = null, age, city, ip, info }) {
        const bcryptedPw = pw ? await bcrypt.hash(pw, 10) : null;
        return table.insert({
            id,
            hash: bcryptedPw,
            age,
            city,
            ip,
            info,
            timestamp: new Date()
        })
    }
}

module.exports = Users;

const user = require('express').Router();

user.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'USER!' });
  });

module.exports = user;

const user = require('express').Router();

user.get('/', (req, res) => {
    console.log("received -> user")
    res.status(200).json({ success: true, message: 'USER!' });
  });

module.exports = user;
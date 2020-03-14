const routes = require('express').Router();
const bodyParser = require('body-parser');

// Require routes
const user = require('./user');

// configure app to use bodyParser()
// this will let us get the data from a POST
routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(bodyParser.json());

routes.use('/user', user);

routes.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Hello world!' });
});

module.exports = routes;

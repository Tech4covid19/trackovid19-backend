require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const logger = require('./utils/logger');

const routes = require('./app/route');

const app = express();

// Add some basic security
app.use(helmet());

const port = process.env.SERVER_PORT || 3000; // set our port

app.use('/', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found.' });
});

// Start the server
app.listen(port);

logger('server').info(`trackovid-19 server started on port ${port}`);

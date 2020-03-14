require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./utils/logger');
const { apiErrorHandler, resourceNotFoundHandler } = require('./utils/express-middleware');

const routes = require('./app/route');

const app = express();

// Add some basic security
app.use(helmet());

// Initialize the REST API logger
app.use(morgan('short', { stream: logger('trackovid-api').restAPILogger }));

const port = process.env.SERVER_PORT || 3000; // set our port

app.use('/', routes);

// Handles with the 404 Not Found
app.use(resourceNotFoundHandler);

// Handles API Error and send a specific error code for the API Rest Consumer instead of the
// stack trace message. Those kind of information should propagated to the logger.
app.use(apiErrorHandler);

// Start the server
app.listen(port);

logger('server').info(`trackovid-19 server started on port ${port}`);

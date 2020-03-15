const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const { json } = require('body-parser');

dotenv.config();

const logger = require('./utils/logger');
const { apiErrorHandler, resourceNotFoundHandler, isAuthenticated } = require('./utils/express-middleware');
const { hasAuthentication } = require('./utils/common');

const api = require('./api');

const app = express();
const serverLogger = logger('server');

app.use(session({
    secret: process.env.APP_SESSION_SALT,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

if (hasAuthentication()) {
    const auth = require('./auth');

    serverLogger.info('Server started with authentication configured');
    auth(app);
}

// Add some basic security
app.use(helmet());

app.use(json());

// Initialize the REST API logger
app.use(morgan('short', { stream: logger('trackovid-api').restAPILogger }));

app.use('/api/', isAuthenticated, api);

// Handles with the 404 Not Found
app.use(resourceNotFoundHandler);

// Handles API Error and send a specific error code for the API Rest Consumer instead of the
// stack trace message. Those kind of information should propagated to the logger.
app.use(apiErrorHandler);

const port = process.env.APP_SERVER_PORT || 3000; // set our port

// Start the server
app.listen(port);

serverLogger.info(`trackovid-19 server started on port ${port}`);

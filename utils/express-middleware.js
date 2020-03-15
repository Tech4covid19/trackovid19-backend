const logger = require('./logger');
const HTTP_STATUS_CODE = require('../enums/http-status-code');
const API_ERRORS = require('../enums/api-errors');
const { hasAuthentication } = require('../utils/common');

/**
 * Handles the unexpected API errors
 */
function apiErrorHandler(err, req, res, next) {
    let errorObject, statusCode = null;

    logger('express-middleware').error(err.stack);

    if (err.status === HTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND) {
        statusCode = HTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND;

        errorObject = API_ERRORS.RESOURCE_NOT_FOUND;
    } else {
        statusCode = HTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR;

        errorObject = API_ERRORS.UNEXPECTED_ERROR;
    }

    // If the current LIST web server was started as development mode (--dev) it will be
    // included the error stack in the error response.
    if (process.env.DEV_MODE === "true") {
        errorObject = {
            ...errorObject,
            stack: err.stack
        };
    }

    res.status(statusCode).send(errorObject);
}

/**
 * Handles the Resource Not Found errors
 */
function resourceNotFoundHandler (req, res, next) {
    const err = new Error('Not Found');
    err.status = HTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND;

    logger('express-middleware').error(`Resource not found. Request: ${req.originalUrl}`);

    next(err);
}

/**
 * Checks if the current API user is Authenticated.
 * If the user is authenticated the response from API should proceed. Otherwise the API should return an response
 * with the unauthorized status code.
 */
function isAuthenticated (req, res, next) {
    if (req.isAuthenticated() || !hasAuthentication() || process.env.MOCK_SERVICES === "true") {
        next();
    } else {
        logger('express-middleware-auth').info(
            `Actual client session ${req.sessionID}, doesn't have permissions to access ${req.originalUrl}`
        );

        res.status(HTTP_STATUS_CODE.CLIENT_ERROR.UNAUTHORIZED).send(API_ERRORS.USER_NOT_AUTHENTICATED);
    }
}

module.exports = {
    apiErrorHandler,
    resourceNotFoundHandler,
    isAuthenticated
};

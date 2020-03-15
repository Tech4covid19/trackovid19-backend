function hasFacebookCredentials () {
    return process.env.FB_APP_ID !== undefined &&
        process.env.FB_APP_SECRET !== undefined &&
        process.env.FB_CALLBACK_URL !== undefined;
}

function hasAuthentication () {
   return hasFacebookCredentials();
}

module.exports = {
    hasAuthentication
};

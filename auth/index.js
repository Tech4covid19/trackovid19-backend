const passport = require('passport');
const facebookAuthProvider = require('./facebook');

module.exports = app => {
    // Use passport
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });

    app.use('/auth/', facebookAuthProvider);
};

const { Router } = require('express');
const router = Router();

const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    enableProof: true
}, function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile._json);
}));

router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/auth/fail",
    }), (req, res) => res.redirect("/api/user/")
);

router.get("/fail", (req, res) => {
    res.send("Failed attempt");
});


module.exports = router;

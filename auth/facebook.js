const { Router } = require('express');
const router = Router();

const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

const Users = require('../api/controllers/users');

passport.use(new Strategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'user_location', 'user_hometown', 'user_gender', 'user_age_range'],
    enableProof: true
}, function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile._json);
}));

router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/auth/fail",
    }), async (req, res) => {
        try {
            await Users.create({ id: req.user.id, age: req.user.user_age_range, city: req.user.user_hometown, ip: req.ip, info: req.user });
            res.redirect("/api/user/")
        } catch (error) {
            if (error.detail.includes('already exists')) {
                res.redirect("/api/user/")
            } else {
                res.redirect("/auth/fail")
            }
        }
    }
);

router.get("/fail", (req, res) => {
    res.send("Failed attempt");
});

module.exports = router;

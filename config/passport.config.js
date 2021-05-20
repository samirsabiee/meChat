const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')

const User = require('../models/user.model')

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({username})
                if (user === null) return done(null, false, {message: 'user not exist'})
                const isValidPass = bcrypt.compareSync(password, user.password)
                if (isValidPass) return done(null, user)
                return done(null, false, {message: 'incorrect password'})
            } catch (e) {
                return done(null, false, {message: e.message});
            }
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id)
            done(null, user);
        } catch (e) {
            done(e, null);
        }
    });
};

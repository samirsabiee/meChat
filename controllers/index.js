const passport = require("passport")
const registerUser = require('../services/registerUser')
module.exports.showLogin = async (req, res) => {
    res.render('login')
}
module.exports.showRegister = async (req, res) => {
    res.render('register')
}
module.exports.register = async (req, res) => {
    await registerUser.register(req, res)
}
module.exports.login = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/meChat",
        failureRedirect: "/",
        failureFlash: true,
    })(req, res, next);
}
module.exports.meChat = (req, res) => {
    res.render('meChat')
}
module.exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
}
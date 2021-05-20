const passport = require("passport");
module.exports.showLogin = (req, res) => {
    res.render('login')
}
module.exports.login = (req, res, next) => {
    /*passport.authenticate("local", {
        successRedirect: "/meChat",
        failureRedirect: "/",
        failureFlash: true,
    })(req, res, next);*/
}
module.exports.meChat = (req, res) => {
    res.render('meChat')
}
module.exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
}
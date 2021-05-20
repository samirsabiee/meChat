const indexController = require('../controllers/index')
const {ensureAuthenticated, forwardAuthenticated} = require('../middlewares/authenticate.middleware')
module.exports = (app, passport) => {
    app.get('/', forwardAuthenticated, indexController.showLogin)
    app.post('/login', passport.authenticate("local", {
        successRedirect: "/meChat",
        failureRedirect: "/",
        failureFlash: true,
    }))
    app.get('/meChat', ensureAuthenticated, indexController.meChat)
    app.get('/logout', indexController.logout)
}
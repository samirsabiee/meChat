const indexController = require('../controllers/index')
const {ensureAuthenticated, forwardAuthenticated} = require('../middlewares/authenticate.middleware')
module.exports = app => {
    app.get('/', forwardAuthenticated, indexController.showLogin)
    app.post('/login', indexController.login)
    app.get('/meChat', ensureAuthenticated, indexController.meChat)
    app.get('/logout', indexController.logout)
}
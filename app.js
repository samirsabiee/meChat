const session = require('express-session')
module.exports = app => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }))
    app.set('view engine', 'ejs')

}
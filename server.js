require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('public'))
const httpServer = require("http").createServer(app);

const session = require('express-session')
const passport = require('passport')
require('./config/passport.config')(passport)

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
})
app.use(sessionMiddleware)
app.use(express.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')

require('./database')
const flash = require('connect-flash')
app.use(flash())
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
});
// Global variables
require('./routes')(app, passport)

require('./socket')(httpServer, sessionMiddleware, passport)

httpServer.listen(process.env.APP_PORT, () => console.log(`Server Running On http:localhost:${process.env.APP_PORT}`))
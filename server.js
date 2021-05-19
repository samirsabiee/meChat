require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true}))
const passport = require('passport')
require('./config/passport.config')(passport)
app.use(express.static('public'))
const httpServer = require("http").createServer(app);
require('./database')
require('./socket')(httpServer)
const flash = require('connect-flash')
require('./app')(app)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
});
require('./routes')(app)
httpServer.listen(3000, () => console.log('app Running...'))
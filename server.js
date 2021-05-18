const express = require('express')
const app = express()
app.use(express.static('public'))
require('./app')(app)
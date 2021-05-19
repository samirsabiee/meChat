const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL,
    {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => {
        console.log('DB connected')
    })
    .catch(err => {
        console.log('Database Connection Error: ', err)
    })
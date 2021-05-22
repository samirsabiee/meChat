const mongoose = require('mongoose')
const byt = require('bcryptjs')
const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

userSchema.pre('save', function (next) {
    this.password = byt.hashSync(this.password, 10);
    next()
})

module.exports = mongoose.model('User', userSchema, 'users')
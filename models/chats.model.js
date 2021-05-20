const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chatsSchema = new Schema({
    text: {type: String, required: true},
    sender: {type: String, required: true},
    receivers: {type: [String], required: true}
}, {timestamps: true})

module.exports = mongoose.model('Chats', chatsSchema, 'chats')
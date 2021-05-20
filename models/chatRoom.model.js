const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chatRoomSchema = new Schema({
    users: {type: [String], required: true, ref: 'User'},
    chats: {type: [String], required: true, ref: 'Chats'}
}, {timestamps: true})

module.exports = mongoose.model('ChatRoom', chatRoomSchema, 'chatroom')
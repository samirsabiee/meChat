/*
require('dotenv').config()
require('./database')
const chatModel = require('./models/chats.model')
const chatRoomModel = require('./models/chatRoom.model')

let users = ["60a6a014db2124113013c7c2", "60a3b1814ac82e326493d62a"]
users.sort()

chatRoomModel.find({users})
    .populate('chats')
    .then(data => {
        console.log(data[0].chats)
    }).catch(err => {
    console.log(err)
})


chatModel.create({
    text: "hello",
    sender: "60a3b1814ac82e326493d62a",
    receivers: ["60a6a014db2124113013c7c2"]
}).then(data => {
    chatRoomModel.create({
        users,
        chats: [data._id]
    }).then(data => {
        console.log(data)
    }).catch(err => {
        console.log('catch chatroom ==> ', err)
    })
})

*/

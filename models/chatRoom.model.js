const chatRoomSchema = require('../database/schema/chatRoom.schema')

module.exports.findOnePopulated = obj => {
    return chatRoomSchema.findOne(sortArrayValue(obj)).populate({
        path: 'chats',
        populate: {path: 'sender', model: 'User'}
    })
}

module.exports.countDocuments = obj => {
    return chatRoomSchema.countDocuments(sortArrayValue(obj))
}

module.exports.appendOrCreate = async obj => {
    if (await this.countDocuments({users: obj.users}) > 0) {
        return chatRoomSchema.updateOne(sortArrayValue({users: obj.users}), {$push: {chats: obj.chatId}})
    } else {
        obj = sortArrayValue(obj)
        return chatRoomSchema.create({users: obj.users, chats: [obj.chatId]})
    }
}

function sortArrayValue(obj) {
    for (let objKey in obj) {
        if (Array.isArray(obj[objKey])) obj[objKey].sort()
    }
    return obj
}
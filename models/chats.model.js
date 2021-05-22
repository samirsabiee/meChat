const chatSchema = require('../database/schema/chats.schema')

module.exports.createPopulatedBySender = async obj => {
    const chat = await chatSchema.create(sortArrayValue(obj))
    return this.findByIdPopulatedBySender(chat._id)
}

module.exports.findByIdPopulatedBySender = id => {
    return chatSchema.findById(id).populate('sender')
}

function sortArrayValue(obj) {
    for (let objKey in obj) {
        if (Array.isArray(obj[objKey])) obj[objKey].sort()
    }
    return obj
}
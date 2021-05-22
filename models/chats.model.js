const chatSchema = require('../database/schema/chats.schema')

module.exports.create = obj => {
 return chatSchema.create(sortArrayValue(obj))
}

function sortArrayValue(obj) {
    for (let objKey in obj) {
        if (Array.isArray(obj[objKey])) obj[objKey].sort()
    }
    return obj
}
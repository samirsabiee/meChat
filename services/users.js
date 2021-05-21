let onlineUsersBySocketId = []

module.exports.connectUser = (userId, username, socketId, room) => {
    onlineUsersBySocketId.push({userId, username, socketId, room})
}
module.exports.disconnectUser = socketId => {
    onlineUsersBySocketId = onlineUsersBySocketId.filter(user => user.socketId !== socketId)
}
module.exports.changeRoom = (userId, room) => {
    onlineUsersBySocketId = onlineUsersBySocketId.map((user, index, arr) => {
        if (user.userId === userId) {
            user.room = room
            return arr
        }
    })
}
module.exports.roomUsers = room => {
    return onlineUsersBySocketId.filter(user => user.room === room)
}

module.exports.allOnlineUsers = () => onlineUsersBySocketId
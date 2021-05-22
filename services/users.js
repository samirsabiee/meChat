let onlineUsers = []

module.exports.connectUser = (userId, username, socketId, room) => {
    onlineUsers.push({userId, username, socketId, room})
}
module.exports.disconnectUser = socketId => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}
module.exports.changeRoom = (userId, room) => {
    onlineUsers = onlineUsers.map((user, index, arr) => {
        if (user.userId === userId) {
            user.room = room
            return arr
        }
    })
}
module.exports.roomUsers = room => {
    return onlineUsers.filter(user => user.room === room)
}

module.exports.allOnlineUsers = () => onlineUsers

module.exports.onlineUserById = userId => {
    return onlineUsers.filter(user => user.userId.toString() === userId)
}
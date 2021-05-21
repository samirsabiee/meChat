module.exports.roomUsersInfo = (userId, username, roomUsers) => {
    return {
        userId,
        username,
        users: roomUsers
    }
}
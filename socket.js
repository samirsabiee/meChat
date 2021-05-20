const socketIO = require('socket.io')
const rooms = require('./services/rooms')
const onlineUsers = require('./services/users')
const templateMessages = require('./services/templateMessages')

module.exports = (httpServer, session, passport) => {
    let io = socketIO(httpServer, {
        path: '/meChat',
        allowRequest: (req, cb) => {
            //console.log(req.session)
            cb(null, true)
        },
    });
    // convert a connect middleware to a Socket.IO middleware
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
    io.use(wrap(session))
    io.use(wrap(passport.initialize()))
    io.use(wrap(passport.session()))

    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            next(new Error('unauthorized'))
        }
    });

    io.on('connection', socket => {
        socket.join(rooms.Family)
        onlineUsers.connectUser(socket.request.user._id, socket.id, rooms.Family)
        const data = templateMessages.userAndUsersRoomInfo(socket.request.user.username, onlineUsers.roomUsers(rooms.Family))
        io.to(rooms.Family).emit('updateUsers', data)
        socket.emit('message', 'connected')
        console.log(onlineUsers.allOnlineUsers())

        socket.on('disconnect', reason => {
            onlineUsers.disconnectUser(socket.id)
            const data = templateMessages.userAndUsersRoomInfo(socket.request.user.username, onlineUsers.roomUsers(rooms.Family))
            io.to(rooms.Family).emit('updateUsers', data)
            console.log('disconnect log', onlineUsers.allOnlineUsers())
        })
    })
}

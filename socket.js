const socketIO = require('socket.io')
const rooms = require('./services/rooms')
const onlineUsers = require('./services/users')
const templateMessages = require('./services/templateMessages')
const chatRoomModel = require('./models/chatRoom.model')
require('./models/chats.model')

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
        socket.join(rooms.All)
        onlineUsers.connectUser(socket.request.user._id, socket.request.user.username, socket.id, rooms.All)
        socket.emit('connection', {userId: socket.request.user._id, username: socket.request.user.username})
        io.to(rooms.All).emit('updateUsers', {users: onlineUsers.roomUsers(rooms.All)})
        socket.emit('message', 'connected')
        socket.on('lastChats', async users => {
            users.push(socket.request.user._id.toString())
            users.sort()
            const chats = await chatRoomModel.find({users}).populate('chats')
            socket.emit('lastChats', chats)
        })
        socket.on('disconnect', reason => {
            onlineUsers.disconnectUser(socket.id)
            io.to(rooms.All).emit('updateUsers', {users: onlineUsers.roomUsers(rooms.All)})
        })
    })
}

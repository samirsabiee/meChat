const socketIO = require('socket.io')
const rooms = require('./services/rooms')
const onlineUsers = require('./services/users')
const chatModel = require('./models/chats.model')
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
            const chats = await chatRoomModel.findOnePopulated({users})
            socket.emit('lastChats', chats)
        })
        socket.on('privateMessage', async data => {
            let userArray = onlineUsers.onlineUserById(data.userId)
            let chat = await chatModel.createPopulatedBySender({
                text: data.text,
                sender: socket.request.user._id,
                receivers: [userArray[0].userId]
            })
            let chatRoom = await chatRoomModel.appendOrCreate({
                chatId: chat._id,
                users: [userArray[0].userId, socket.request.user._id]
            })
            if (chatRoom !== undefined && chatRoom.hasOwnProperty('nModified') || chatRoom.hasOwnProperty('chats')) {
                userArray.forEach(user => {
                    io.to(user.socketId).emit('privateMessage', chat)
                })
            } else {
                socket.emit('message', {message: 'fail to send chat message'})
            }
        })
        socket.on('disconnect', reason => {
            onlineUsers.disconnectUser(socket.id)
            io.to(rooms.All).emit('updateUsers', {users: onlineUsers.roomUsers(rooms.All)})
        })
    })
}

const socketIO = require('socket.io')
const rooms = require('./services/rooms')

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
        console.log(socket.rooms)
        socket.emit('connection', {username: socket.request.user.username})
        socket.emit('message', 'connected')
    })
}

const socketIO = require('socket.io')
module.exports = httpServer => {
    let io;
    io = socketIO(httpServer);
}
const socket = io('http://localhost:3000', {
    path: '/meChat',
})
socket.on("connection", (data) => {
    console.log('connecting...')
    document.querySelector('.username').textContent = `Hello ${data.username}`
})
socket.on('message', data => {
    console.log(data)
})

socket.on('private', data => {
    console.log(data)
})
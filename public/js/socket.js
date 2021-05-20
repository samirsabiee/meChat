const socket = io('http://localhost:3000', {
    path: '/meChat',
})
socket.on("connection", (data) => {
    console.log('connecting...')
})
socket.on('message', data => {
    console.log(data)
})

socket.on('private', data => {
    console.log(data)
})
socket.on('updateUsers', data => {
    console.log(data)
    document.querySelector('.username').textContent = `Hello ${data.username}`
})
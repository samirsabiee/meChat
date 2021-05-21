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
    attachOnlineUsers(data.users)
})

socket.emit('lastChats', {userId: "60a6a014db2124113013c7c2"})

function attachOnlineUsers(users) {
    let ul = document.querySelector('.onlineUsers')
    ul.innerHTML = ""
    users.forEach((user, index) => {
        let li = document.createElement('li')
        li.textContent = user.userId
        ul.appendChild(li)
    })
}
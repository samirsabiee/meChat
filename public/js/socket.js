const userInfo = {}
const socket = io('http://localhost:3000', {
    path: '/meChat',
})
socket.on("connection", (data) => {
    console.log('connecting...')
    userInfo.username = data.username
    userInfo.userId = data.userId
    document.querySelector('.username').textContent = `Hello ${data.username}`
})
socket.on('message', data => {
    console.log(data)
})

socket.on('private', data => {
    console.log(data)
})
socket.on('updateUsers', ({users}) => {
    console.log(users)
    attachOnlineUsers(users)
})

socket.on('lastChats', data => {
    console.log(data)
})
document.querySelector('.new-message').addEventListener('click', e => {
    let users = ["60a6a014db2124113013c7c2"]
    socket.emit('lastChats', users)
})

function attachOnlineUsers(users) {
    let ul = document.querySelector('.onlineUsers')
    ul.innerHTML = ""
    users.forEach((user, index) => {
        if (user.userId !== userInfo.userId) {
            let li = createOnlineUserElement(user)
            ul.appendChild(li)
        }
    })
}

function createOnlineUserElement(user) {
    let li = document.createElement('li')
    li.setAttribute('data-toggle', 'tab')
    li.setAttribute('data-target', `#user-${user.userId}`)
    let img = document.createElement('img')
    img.setAttribute('alt', '')
    img.classList.add('img-circle', 'medium-image')
    img.setAttribute('src', 'https://bootdey.com/img/Content/avatar/avatar1.png')
    li.appendChild(img)
    //--------------------------
    let middleDiv = document.createElement('div')
    middleDiv.classList.add('vcentered', 'info-combo')
    let h3 = document.createElement('h3')
    h3.classList.add('no-margin-bottom', 'name')
    h3.innerText = user.username
    let h5 = document.createElement('h5')
    h5.innerText = user.userId
    middleDiv.appendChild(h3)
    middleDiv.appendChild(h5)
    li.appendChild(middleDiv)
    //---------------------------
    let lastDiv = document.createElement('div')
    lastDiv.classList.add('contacts-add')
    let span = document.createElement('span')
    span.classList.add('message-time')
    span.textContent = "00:00"
    let sup = document.createElement('sup')
    sup.textContent = "AM"
    span.appendChild(sup)
    let i1 = document.createElement('i')
    i1.classList.add('fa', 'fa-trash-o')
    let i2 = document.createElement('i')
    i2.classList.add('fa', 'fa-paperclip')
    lastDiv.appendChild(span)
    lastDiv.appendChild(i1)
    lastDiv.appendChild(i2)
    li.appendChild(lastDiv)
    return li

}
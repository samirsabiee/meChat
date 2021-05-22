const userInfo = {}

let tabCategorySelected = "All"

const socket = io('http://localhost:3000', {
    path: '/meChat',
})

$(document).ready(function () {
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
        let chatBody = document.querySelector('.mChatBody')
        chatBody.innerHTML = ""
        data.chats.forEach(chat => {
            if (chat.sender._id === userInfo.userId)
                chatBody.append(createMyMessageTemplate(chat))
            else chatBody.append(createAudienceMessage(getTabCategorySelectedColor(), chat))
        })
    })

    socket.on('privateMessage', data => {
        console.log(data)
        //appendChatMessage()
    })

    document.querySelectorAll('.tab-category').forEach(tab => {
        tab.addEventListener('click', e => {
            clearTabCategoryActiveClass()
            e.target.classList.add('active')
            tabCategorySelected = e.target.innerText
        })
    })

    document.querySelector('.send-message-button').addEventListener('click', e => {
        let userId = getPVUserId()
        if (userId !== "1") {
            let text = getTextInputMessage()
            socket.emit('privateMessage', {userId, text})
        } else alert('select user')

    })

    function attachOnlineUsers(users) {
        let ul = document.querySelector('.onlineUsers')
        ul.innerHTML = ""
        users.forEach(user => {
            if (user.userId !== userInfo.userId) {
                let li = createOnlineUserElement(user)
                ul.appendChild(li)
            }
        })
    }

    function setTabBodyContentId(userId) {
        let mTabBody = document.querySelector('.mTabBody')
        mTabBody.setAttribute('id', `user-${userId}`)
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
        middleDiv.append(h3, h5)
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
        lastDiv.append(span, i1, i2)
        li.appendChild(lastDiv)
        addOnlineUserListItemClickListener(li)
        return li
    }

    function addOnlineUserListItemClickListener(li) {
        li.addEventListener('click', function (e) {
            if (e.target !== this)
                return
            let users = []
                , userId = e.target.getAttribute('data-target').split('-')[1]
            users.push(userId)
            socket.emit('lastChats', users)
            setTabBodyContentId(userId)
        })
    }

    function createMyMessageTemplate(chat) {
        //-----------------------------------------
        let myMessageDiv = document.createElement('div')
        myMessageDiv.classList.add('message', 'my-message')
        let img = document.createElement('img')
        img.classList.add('img-circle', 'medium-image')
        img.setAttribute('src', 'https://bootdey.com/img/Content/avatar/avatar1.png')
        //-----------------------------------------
        let messageBodyDiv = document.createElement('div')
        messageBodyDiv.classList.add('message-body')
        let messageBodyInnerDiv = document.createElement('div')
        messageBodyDiv.classList.add('message-body-inner')
        let messageInfoDiv = document.createElement('div')
        messageInfoDiv.classList.add('message-info')
        let h4 = document.createElement('h4')
        h4.innerText = chat.sender.username
        let h5 = document.createElement('h5')
        let i = document.createElement('i')
        i.classList.add('fa', 'fa-clock-o')
        h5.appendChild(i)
        h5.innerText = chat.createdAt
        messageInfoDiv.append(h4, h5)
        let hr = document.createElement('hr')
        let messageTextDiv = document.createElement('div')
        messageTextDiv.classList.add('message-text')
        messageTextDiv.innerText = chat.text
        messageBodyInnerDiv.append(messageInfoDiv, hr, messageTextDiv)
        messageBodyDiv.appendChild(messageBodyInnerDiv)
        let br = document.createElement('br')
        myMessageDiv.append(img, messageBodyDiv, br)
        return myMessageDiv
    }

    function createAudienceMessage(bg_color, chat) {

        let audienceMessageDiv = document.createElement('div')
        audienceMessageDiv.classList.add('message', bg_color)
        let img = document.createElement('img')
        img.classList.add('img-circle', 'medium-image')
        img.setAttribute('src', 'https://bootdey.com/img/Content/avatar/avatar1.png')
        //------------------------------
        let messageBodyDiv = document.createElement('div')
        messageBodyDiv.classList.add('message-body')
        let messageInfoDiv = document.createElement('div')
        messageInfoDiv.classList.add('message-info')
        let h4 = document.createElement('h4')
        h4.innerText = chat.sender.username
        let h5 = document.createElement('h5')
        let i = document.createElement('i')
        i.classList.add('fa', 'fa-clock-o')
        h5.appendChild(i)
        h5.innerText = chat.createdAt
        messageInfoDiv.append(h4, h5)
        let hr = document.createElement('hr')
        let messageTextDiv = document.createElement('div')
        messageTextDiv.classList.add('message-text')
        messageTextDiv.innerText = chat.text
        messageBodyDiv.append(messageInfoDiv, hr, messageTextDiv)
        let br = document.createElement('br')
        audienceMessageDiv.append(img, messageBodyDiv, br)

        return audienceMessageDiv
    }

    function clearTabCategoryActiveClass() {
        let tabs = document.querySelector('.inbox-categories').children
        for (let tab of tabs) {
            tab.classList.remove('active')
        }
    }

    function getTabCategorySelectedColor() {
        switch (tabCategorySelected) {

            case "All":
                return 'dark'
            case "Family":
                return 'info'
            case "Social":
                return 'success'
            case "Friends":
                return 'warning'
            default:
                return 'danger'

        }
    }

    function getTextInputMessage() {
        return $('.send-message-text').val()
    }

    function getPVUserId() {
        return $('.mTabBody').attr('id').split('-')[1]
    }

    function appendChatMessage(chat) {
        let chatBody = $('.mChatBody')
        if (chat.sender._id === userInfo.userId)
            chatBody.append(createMyMessageTemplate(chat))
        else chatBody.append(createAudienceMessage(getTabCategorySelectedColor(), chat))
    }
})
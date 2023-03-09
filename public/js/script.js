const socket = io();
let chats = document.querySelector('.chats')
let usersList = document.querySelector(".users-list");
let usersCount = document.querySelector(".users-count");
let msgSend=document.querySelector("#user-send")
let userMsg=document.querySelector("#user-msg")

let Name;

do {
    Name = prompt("Enter your name");
} while (!Name);


// It will be call when you will be joined
socket.emit("new-user", Name);
function userJoinLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `
    <p><b>${name}</b> ${status} the chat...</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

// notify that user joined
socket.on('Username', (socketName) => {
    userJoinLeft(socketName, "joined");
})

// notify that user disconnected
socket.on('user-disconnect', (user) => {
    userJoinLeft(user, "Left");
})

// for updating user list
socket.on('user-list', (users) => {
    usersList.innerHTML = "";
    usersArr = Object.values(users);
    for (let i = 0; i < usersArr.length; i++) {
        let p = document.createElement('p');
        p.innerText = usersArr[i];
        usersList.appendChild(p);
    }
    usersCount.innerHTML = usersArr.length;
})

//for send message
msgSend.addEventListener('click', () => {
    let data = {
        user: Name,
        msg: userMsg.value
    };
    if (userMsg.value != "") {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        userMsg.value = "";
    }
});

function appendMessage(data, status) {
    let div = document.createElement('div')
    div.classList.add('message', status);
    let content = `
        <h5>${data.user}</h5>
        <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data, 'incoming');
})
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.port || 3000;
var users = {};

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// Socket setup
io.on("connection", (socket) => {
    console.log("A Connection is established with this id " + socket.id);
    socket.on("new-user", (Name) => {
        users[socket.id] = Name;
        socket.broadcast.emit("Username", Name);
        io.emit('user-list', users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnect', (user = users[socket.id]));
        delete users[socket.id];
        io.emit('user-list', users);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('message', { user: data.user, msg: data.msg });
    })
});

server.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
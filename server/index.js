const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const setUpEventsHandlers = require('./routes');
const socketIo = require('socket.io');
require('dotenv').config();

let app = express();

app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:3000',
    ],
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("vse chetka");
});


const server = http.Server(app);
server.listen(8080, '127.0.0.1');

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('connected');
    setUpEventsHandlers(socket);
});
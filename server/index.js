const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/authentification');
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

app.use('/', tasksRouter);

app.use('/', authRouter);

app.get("/", (req, res) => {
    res.send("Everything is working.");
})


app.listen(8080, () => {
    console.log("Server started")
})

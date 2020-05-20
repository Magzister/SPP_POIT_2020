const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/authentification');
const { ApolloServer, gql } = require('apollo-server-express');
const { isValidToken } = require('./helpers/jwtHelpers');
const { checkForUserExistence } = require('./controllers/user');
const { schema, resolvers } = require('./graphql/schema');
const { removeToken } = require('./helpers/jwtHelpers');
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

app.use('/signIn', checkForUserExistence);

app.use('/signOut', removeToken);

app.use('/graphql', isValidToken);

const server = new ApolloServer({ typeDefs: gql(schema), resolvers, context: ({ req, res }) => ({ req, res }) });

server.applyMiddleware({
    app, path: '/graphql', cors: {
        credentials: true,
        origin: true
    },
});

app.listen(8080, () => {
    console.log("Server started")
});
const {getTasks, postTask,  updateTask, deleteTask, signIn, signUp} = require('../event-constants');
const taskControllers = require('../controllers/tasks');
const userControllers = require('../controllers/user');

module.exports = setUpEventsHandlers = (socket) => {
    socket.on(signIn, (data) => userControllers.checkForUserExistence(socket, data));
    socket.on(signUp, (data) => userControllers.createNewUser(socket, data));
    socket.on(getTasks, (data) => taskControllers.getTasks(socket, data));
    socket.on(postTask, (data) => taskControllers.addTask(socket, data));
    socket.on(updateTask, (data) => taskControllers.updateTask(socket, data));
    socket.on(deleteTask, (data) => taskControllers.deleteTask(socket, data));
}
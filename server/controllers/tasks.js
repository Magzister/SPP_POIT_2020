const Task = require('../models/task');
const {isValidToken} = require('../helpers/jwtHelpers');
const {getTasks, postTask,  updateTask, deleteTask} = require('../event-constants');

exports.getTasks = async (socket, data) => {

    console.log(data);

    const { progress, token } = data;

    const userId = isValidToken(token);

    if(userId){
        try {
            let tasks = await Task.find({ userId, progress: { $in: progress } });

            return socket.emit(getTasks, {tasks});

        } catch (err) {
            console.log(err);
            return socket.emit(getTasks, {error: 'Server error'});
        }
    }

    socket.emit(getTasks, {error: 'Unauthorised'});

}

exports.addTask = async (socket, data) => {

    console.log('here');

    console.log(data);

    const { description, date, file, progress, token, index } = data;

    const userId = isValidToken(token);

    if(userId){
        try {

            let task = new Task({
                description,
                date,
                file,
                progress,
                userId
            });

            task = await task.save();

            console.log(task._doc);

            return socket.emit(postTask, {...task._doc, index});

        } catch (err) {
            console.log(err);
            return socket.emit(postTask, {error: 'Server error'});
        }
    }

    socket.emit(postTask, {error: 'Unauthorised'});

}

exports.updateTask = async (socket, data) => {

    const { taskId, description, date, file, progress, token } = data;

    const userId = isValidToken(token);

    if(userId){
        try {

            const updatedTask = await Task.updateOne({ _id: taskId }, { $set: { description, date, file, progress } });

            return socket.emit(updateTask, {...updatedTask, taskId});

        } catch (err) {
            console.log(err);
            return socket.emit(updateTask, {error: 'Server error'});
        }
    }

    socket.emit(updateTask, {error: 'Unauthorised'});

}

exports.deleteTask = async (socket, data) => {

    const { taskId, token } = data;

    const userId = isValidToken(token);

    if(userId){
        try {

            const result = await Task.findByIdAndDelete(taskId);

            console.log(result);

            return socket.emit(deleteTask, {msg: 'successfully'});

        } catch (error) {
            console.log(err);
            return socket.emit(deleteTask, {error: 'Server error'});
        }
    }

    socket.emit(deleteTask, {error: 'Unauthorised'});

}

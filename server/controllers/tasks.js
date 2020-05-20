const Task = require('../models/task');

exports.getTasks = async (_, { progress }, { req, res }) => {

    if (req.user) {
        try {
            let tasks = await Task.find({ userId: req.user.id, progress: { $in: progress } });

            return tasks;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    throw new Error('unathorised');
}

exports.addTask = async (_, { task: { description, date, progress } }, { req, res }) => {

    if (req.user) {
        try {

            let task = new Task({
                description,
                date,
                file: null,
                progress,
                userId: req.user.id
            });

            task = await task.save();

            console.log(task);

            return task;

        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    throw new Error('unathorised');
}

exports.updateTask = async (_, { task: { id, description, date, progress } }, { req }) => {

    console.log(req.user);
    console.log(id);
    if (req.user) {
        try {

            const updatedTask = await Task.findOneAndUpdate({ _id: id }, { $set: { description, date, progress } });

            console.log(updatedTask);

            return updatedTask;

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    throw new Error('unathorised');
}

exports.deleteTask = async (_, { taskId }, { req, res }) => {

    if (req.user) {
        try {

            const result = await Task.findByIdAndDelete(taskId);

            return result;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    throw new Error('unathorised');
}
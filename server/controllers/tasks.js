const Task = require('../models/task');

exports.getTasks = async (req, res, next) => {

    const { progress } = req.query;

    try {
        let tasks = await Task.find({ userId: req.user.id, progress: { $in: progress.split(',') } });

        return res.status(200).send(tasks);

    } catch (err) {
        return res.status(500).send();
    }

}

exports.addTask = async (req, res, next) => {
    const { description, date, file, progress } = req.body;

    try {

        let task = new Task({
            description,
            date,
            file,
            progress,
            userId: req.user.id
        });

        task = await task.save();

        return res.status(200).send(task);

    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }

}

exports.updateTask = async (req, res) => {

    const { taskId } = req.params;
    const { description, date, file, progress } = req.body;

    try {

        const updatedTask = await Task.updateOne({ _id: taskId }, { $set: { description, date, file, progress } });

        res.status(200).send(updatedTask);

    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

exports.deleteTask = async (req, res) => {

    console.log(req.params);

    const { taskId } = req.params;

    try {

        console.log("deletion");

        const result = await Task.findByIdAndDelete(taskId);

        console.log(result);

        res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }

}
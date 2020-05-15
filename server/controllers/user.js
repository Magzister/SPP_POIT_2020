const User = require('../models/user');
const validator = require('validator');
const jwtHelpers = require('../helpers/jwtHelpers');

exports.createNewUser = async (req, res, next) => {

    console.log(req.body);

    const { nick, password } = req.body;

    try {
            const userWithSamenick = await User.findOne({ nick });

            if (!userWithSamenick) {

                const newUser = new User({ nick, password });

                await newUser.save();

                res.sendStatus(200);
            } else {
                res.status(500).send('This nick is busy');
            }

    } catch (err) {
        console.log(err);
    }

}

exports.checkForUserExistence = async (req, res, next) => {

    const { nick, password } = req.body;

    try {

        const user = await User.findOne({ nick });

        if (user) {

            user.validPassword(password, (err, result) => {
                if (result) {
                    jwtHelpers.createToken(res, { nick, id: user._id });
                } else {
                    return res.status(401).send('Incorrect password');
                }
            })

        } else {
            res.status(401).send('There are no such user.');
        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

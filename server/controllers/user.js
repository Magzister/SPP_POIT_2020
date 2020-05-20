const User = require('../models/user');
const jwtHelpers = require('../helpers/jwtHelpers');

exports.createNewUser = async (_, { nick, password }) => {

    console.log(nick);

    try {


            const userWithSamenick = await User.findOne({ nick });

            if (!userWithSamenick) {

                const newUser = new User({ nick, password });

                await newUser.save();

                return 'successfully';

            } else {
                throw new Error('This nick is busy');
            }

    } catch (err) {
        console.log(err);
        throw err;
    }

}

exports.checkForUserExistence = async (req, res) => {

    const { nick, password } = req.body;

    try {

        const user = await User.findOne({ nick });

        if (user) {

            user.validPassword(password, (err, result) => {
                if (result) {
                    jwtHelpers.createToken(res, { nick, id: user._id });
                    res.status(200).send();

                } else {
                    res.status(500).send('Incorrect password');
                }
            })

        } else {
            res.status(500).send('There are no such user.');
        }

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

const User = require('../models/user');
const jwtHelpers = require('../helpers/jwtHelpers');
const {signIn, signUp} = require('../event-constants');


exports.createNewUser = async (socket, data) => {

    console.log(data);

    const { nick, password } = data;

    try {

            const userWithSamenick = await User.findOne({ nick });

            if (!userWithSamenick) {

                const newUser = new User({ nick, password });

                await newUser.save();

                return socket.emit(signUp, { msg: 'successfully'});

            } else {
                return socket.emit(signUp, { error: 'This nick is busy'});
            }

    } catch (err) {
        console.log(err);
        return socket.emit(signUp, { error: 'Server error'});
    }

}

exports.checkForUserExistence = async (socket, data) => {

    console.log(data);

    const { nick, password } = data;

    try {

        const user = await User.findOne({ nick });

        if (user) {

            user.validPassword(password, (err, result) => {
                if (result) {
                    const token = jwtHelpers.createToken({ nick, id: user._id });
                    return socket.emit(signIn, {token});
                } else {
                    return socket.emit(signIn, { error: 'Incorrect password'});
                }
            })

        } else {
            return socket.emit(signIn, { error: 'There are no such user.'});
        }

    } catch (error) {
        console.log(error);
        return socket.emit(signIn, { error: 'Server error'});
    }
}

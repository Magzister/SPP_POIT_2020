const userRouter = require('express').Router();
const userController = require('../controllers/user');
const jwtHelpers = require('../helpers/jwtHelpers');

userRouter.post('/signUp', userController.createNewUser);

userRouter.post('/signIn', userController.checkForUserExistence);

userRouter.get('/signOut', jwtHelpers.removeToken);

module.exports = userRouter;
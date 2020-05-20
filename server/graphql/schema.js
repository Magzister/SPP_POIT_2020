const taskControllers = require('../controllers/tasks');
const userControllers = require('../controllers/user');

exports.schema = `
  type User {
    id: Int!
    username: String!
    nick: String!
  }

  type Task {
    _id: String!
    description: String!
    date: String!
    progress: String!
  }

  input TaskInput {
    id: String
    description: String!
    date: String!
    progress: String!
  }

  type Query {
    getTasks(progress: [String!]!): [Task!]!
  }

  type Mutation {
    signUp (nick: String!, password: String!): String
    createTask(task: TaskInput!): Task!
    updateTask(task: TaskInput!): Task!
    deleteTask(taskId: String!): Task!
  }
`

exports.resolvers = {
  Query: {
    getTasks: taskControllers.getTasks,
  },
  Mutation: {
    signUp: userControllers.createNewUser,
    createTask: taskControllers.addTask,
    updateTask: taskControllers.updateTask,
    deleteTask: taskControllers.deleteTask
  }
}

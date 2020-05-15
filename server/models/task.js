const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("../node_modules/dotenv").config();

mongoose.connect(process.env.DB_ADDRESS, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "MPP3" })
    .catch(error => {
        console.log(error);
    });
mongoose.set('useCreateIndex', true);
mongoose.set("useFindAndModify", true);

let taskScheme = new Schema({

    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: null
    },
    filepath: {
        type: String,
        default: null
    },
    progress: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
})

module.exports = mongoose.model("taskWithUserId", taskScheme)

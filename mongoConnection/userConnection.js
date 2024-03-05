const mongoose = require("mongoose");
const Path = require('path');
const { config } = require('dotenv');
const User = require("../user");

class userStorage {
    constructor(entity) {
        this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
        this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
        this.connect();
    }   

    connect() {
        const connectionUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
        mongoose
            .connect(connectionUri)
            .then(() => {
                console.log('Connected to the database');
            })
            .catch((error) => {
                console.error('Error connecting to the database', error);
            });
    }

getUsers = () => {
    return this.Model.findUsers();
}

getUserId = (userId) => {
    return this.Model.find({ id: userId });
}

createUser = (User) => {
    return this.Model.create(User);
}

updateUser = (userId, User) => {
    return this.Model.updateOne({ userId }, User);
}

deleteUser = (userId) => {
    return this.Model.deleteOne({ userId: User });
}

existUser = (userID) => {
    return this.Model.exists({ userID: User });
}
}
module.exports = { userStorage };
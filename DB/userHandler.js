const Path = require('path');
require('dotenv').config();
const User = require('../User');

class userHandler {
  constructor(entity) {
    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
  }

  getUsers = () => this.Model.findUsers();

  getUserId = (userId) => this.Model.find({ id: userId });

  createUser = (User) => this.Model.create(User);

  updateUser = (userId, User) => this.Model.updateOne({ userId }, User);

  deleteUser = (userId) => this.Model.deleteOne({ userId: User });

  existUser = (userID) => this.Model.exists({ userID: User });
}
module.exports = { userHandler };

const {UserStorage} = require('../mongoConnection/userConnection');

class UserRepository {
    constructor() {
      this.userStorage = new UserStorage('user');
    }

    findUsers() {
        return this.userStorage.getUsers();
    }

    getuserId(userId) {
        return this.userStorage.findUsers({ id: userId });
    }

    createUser(User) {
        return this.userStorage.createUser(User);
    }

    updateUser(userId, User) {
        return this.userStorage.updateUser({ userId }, User);
    }

    deleteUser(userId) {
        return this.userStorage.deleteUser({ userId: User });
    }

    userExist(userID) {
        return this.userStorage.userExist({ userID: User });
    }
  }
module.exports = UserRepository;
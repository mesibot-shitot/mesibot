const Song = require('./Song');
const UserRepository = require('./repository/userRepository');

class User {
    constructor({ id, username}) {
        this.id = id;
        this.username = username;
        this.songsAdded = [];
        this.songsLiked = [];
        this.songsDisliked = [];
        this.playlists = [];
    }
    }
    module.exports = User;
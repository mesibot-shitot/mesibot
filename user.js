const Song = require('./Song');

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
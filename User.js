const Song = require('./Song');

class User {
  songsAdded = [];

  songsLiked = [];

  songsDisliked = [];

  playlists = [];

  constructor({ id, username }) {
    this.id = id;
    this.username = username;
  }
}
module.exports = User;

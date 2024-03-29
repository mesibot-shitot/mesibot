const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: Number, unique: true },
  username: { type: String },
  songsAdded: { type: Array },
  songsLiked: { type: Array },
  songsDisliked: { type: Array },
  playlists: { type: Array },
}, this.collection = 'user');
module.exports = model('user', userSchema);

const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
  groupId: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
  queue: { type: Array },
  playedList: { type: Array },
}, this.collection = 'playlist');
module.exports = model('playlist', playlistSchema);

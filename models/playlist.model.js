const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    groupId: { type: String },
    name: { type: String },
    queue: { type: Array },
    playedList: { type: Array },
}, this.collection = 'playlist');
module.exports = model('playlist', playlistSchema);
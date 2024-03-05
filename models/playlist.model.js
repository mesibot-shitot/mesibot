const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    playlistId: { type: Number, unique: true },
    name: { type: String },
    player: { type: String },
    queue: { type: Array },
    playedList: { type: Array },
    current: { type: String },
}, this.collection = 'playlist');
module.exports = model('playlist', playlistSchema);
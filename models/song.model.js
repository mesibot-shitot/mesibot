const { Schema, model } = require('mongoose');

const songSchema = new Schema({
    songId: { type: String, unique: true },
    name: { type: String },
    priority: { type: Number },
    url: { type: String },
    thumbnail: { type: String },
    duration: { type: String },
    requestedBy: { type: String },
    Played: { type: Boolean },
    vote: { type: Array },
}, this.collection = 'song');
module.exports = model('song', songSchema);
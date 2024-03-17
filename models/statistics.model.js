const { Schema, model } = require('mongoose');
const { schema } = require('./playlist.model');

const statisticsSchema = new Schema({
    groupId: { type: String, index: true, required: true },
    userId: { type: String, index: true },
    playlist: { type: Schema.Types.ObjectId, ref: 'playlist' },
    action: { type: String, required: true, enum: ['add', 'downvote', 'upvote', 'skip', 'newConnection', 'playlistSaved', 'playlistImported', 'songRemoved'] },
    songId: { type: String },
    timestemp: { type: Date, default: Date.now },
}, this.collection = 'statistics');
module.exports = model('statistics', statisticsSchema);
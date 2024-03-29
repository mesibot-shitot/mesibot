const Path = require('path');
require('dotenv').config();
const Playlist = require('../Playlist');

class playlistHandler {
  constructor(entity) {
    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
  }

  getPlaylists = () => this.Model.findPlaylist();

  getPlaylistById = (_id) => this.Model.findOne({ _id });

  getGroupPlaylist = (groupId, name) => this.Model.findOne({ groupId, name });

  createPlaylist = (Playlist) => this.Model.create(Playlist);

  getGroupPlaylists = (groupId) => this.Model.find({ groupId });

  getGroupsActivePlaylists = (groupId) => this.Model.find({ groupId, isDraft: false });

  putPlaylist = (_id, playlist) => this.Model.updateOne({ _id }, playlist);

  deletePlaylist = (playlistId) => this.Model.deleteOne({ _id: playlistId });

  existPlaylist = (playlistID) => this.Model.exists({ playlistID: Playlist });
}

module.exports = { playlistHandler };

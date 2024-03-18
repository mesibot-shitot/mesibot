const mongoose = require('mongoose');
const Path = require('path');
const { config } = require('dotenv');
const Playlist = require('../Playlist');
const DbConnection = require('./DbConnection');

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

  deletePlaylist = (playlistId) => this.Model.deleteOne({ playlistId: Playlist });

  existPlaylist = (playlistID) => this.Model.exists({ playlistID: Playlist });
}

module.exports = { playlistHandler };

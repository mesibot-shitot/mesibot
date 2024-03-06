const mongoose = require('mongoose');
const Path = require('path');
const { config } = require('dotenv');
const Song = require('../Song');
const DbConnection = require('./DbConnection');

class SongHandler {

  constructor(entity) {
    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
  }

  getSongs = () => this.Model.findSongs();

  getSongId = (songId) => this.Model.find({ id: songId });

  createSong = (Song) => this.Model.create(Song);

  updateSong = (songId, Song) => this.Model.updateOne({ songId }, Song);

  deleteSong = (songId) => this.Model.deleteOne({ songId: Song });

  existSong = (songID) => this.Model.exists({ songID: Song });
}
module.exports = { SongHandler };

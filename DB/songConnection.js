const mongoose = require('mongoose');
const Path = require('path');
const { config } = require('dotenv');
const Song = require('../Song');

class SongStorage {
  constructor(entity) {
    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
    this.connect();
  }

  connect() {
    const connectionUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
    mongoose
      .connect(connectionUri)
      .then(() => {
        console.log('Connected to the database');
      })
      .catch((error) => {
        console.error('Error connecting to the database', error);
      });
  }

  getSongs = () => this.Model.findSongs();

  getSongId = (songId) => this.Model.find({ id: songId });

  createSong = (Song) => this.Model.create(Song);

  updateSong = (songId, Song) => this.Model.updateOne({ songId }, Song);

  deleteSong = (songId) => this.Model.deleteOne({ songId: Song });

  existSong = (songID) => this.Model.exists({ songID: Song });
}
module.exports = { SongStorage };

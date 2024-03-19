const mongoose = require('mongoose');
const Path = require('path');
const { config } = require('dotenv');
const Song = require('../Song');
const DbConnection = require('./DbConnection');

class StatHandler {
  constructor(entity) {
    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
  }

  createStat = (stat) => this.Model.create(stat);

  getSongStatsByGroup = (groupId, songId) => this.Model.find({ groupId, 'song.songId': songId });
}
module.exports = { StatHandler };

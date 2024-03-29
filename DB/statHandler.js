const Path = require('path');
require('dotenv').config();

class StatHandler {
  constructor(entity) {
    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
  }

  createStat = (stat) => this.Model.create(stat);

  putStat = (_id, stat) => this.Model.updateOne({ _id }, stat);

  getSongStatsByGroup = (groupId, songId) => this.Model.find({ groupId, 'song.songId': songId });
}
module.exports = { StatHandler };

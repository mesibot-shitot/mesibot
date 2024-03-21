const { StatHandler } = require('../DB/statHandler');
const { Song } = require('../Song');

class StatRepository {
  constructor() {
    this.statStorage = new StatHandler('statistics');
  }

  createAction(stat) {
    return this.statStorage.createStat(stat);
  }

  updateAction(id, stat) {
    return this.statStorage.putStat(id, stat);
  }

  fetchSongStatsByGroup(groupId, songId) {
    return this.statStorage.getSongStatsByGroup(groupId, songId);
  }
}
module.exports = StatRepository;

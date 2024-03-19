const { StatHandler } = require('../DB/statHandler');
const { Song } = require('../Song');

class StatRepository {
  constructor() {
    this.statStorage = new StatHandler('statistics');
  }

  createAction(stat) {
    return this.statStorage.createStat(stat);
  }

  fetchSongStatsByGroup(groupId, songId) {
    return this.statStorage.getSongStatsByGroup(groupId, songId);
  }
}
module.exports = StatRepository;

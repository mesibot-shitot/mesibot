const { statHandler } = require('../DB/statHandler');
const { Song } = require('../Song');

class statRepository {
  constructor() {
    this.statStorage = new statHandler('statistics');
  }

  createAction(stat) {
    return this.statStorage.createStat(stat);
  }
}
module.exports = statRepository;

const { SongHandler } = require('../DB/songHandler');
const { Song } = require('../Song');

class SongRepository {
  constructor() {
    this.songStorage = new SongHandler('song');
  }

  findSongs() {
    return this.songStorage.getSongs();
  }

  getSongId(songId) {
    return this.songStorage.findSongs({ id: songId });
  }

  createSong(Song) {
    return this.songStorage.createSong(Song);
  }

  updateSong(songId, Song) {
    return this.songStorage.updateSong({ songId }, Song);
  }

  deleteSong(songId) {
    return this.songStorage.deleteSong({ songId: Song });
  }

  songExist(songID) {
    return this.songStorage.songExist({ songID: Song });
  }
}
module.exports = SongRepository;

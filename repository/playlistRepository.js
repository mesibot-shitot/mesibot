const { MongoStorage } = require('../DB/playlistConnection');

class PlaylistRepository {
  constructor() {
    this.playlistStorage = new MongoStorage('playlist');
  }

  findPlaylists() {
    return this.playlistStorage.getPlaylists();
  }

  getplaylistId(playlistId) {
    return this.playlistStorage.findPlaylists({ id: playlistId });
  }

  createPlaylist(Playlist) {
    return this.playlistStorage.createPlaylist(Playlist);
  }

  updatePlaylist(playlistId, Playlist) {
    return this.playlistStorage.updatePlaylist({ playlistId }, Playlist);
  }

  deletePlaylist(playlistId) {
    return this.playlistStorage.deletePlaylist({ playlistId: Playlist });
  }

  playlistExist(playlistID) {
    return this.playlistStorage.playlistExist({ playlistID: Playlist });
  }
}
module.exports = PlaylistRepository;

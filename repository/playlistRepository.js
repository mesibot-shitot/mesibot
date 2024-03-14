const { playlistHandler } = require('../DB/playlistHandler');
const { Playlist } = require('../Playlist');

class PlaylistRepository {
  constructor() {
    this.playlistStorage = new playlistHandler('playlist');
  }

  fetchGroupPlaylists(id) {
    return this.playlistStorage.getGroupPlaylists(id);
  }

  getPlaylistById(playlistId) {
    return this.playlistStorage.getPlaylistById(playlistId);
  }

  createPlaylist(Playlist) {
    return this.playlistStorage.createPlaylist(Playlist);
  }

  updatePlaylist(playlistID, playlist) {
    return this.playlistStorage.putPlaylist(playlistID, playlist);
  }

  fetchGroupPlaylist(groupId, name) {
    return this.playlistStorage.getGroupPlaylist(groupId, name);
  }

  deletePlaylist(playlistId) {
    return this.playlistStorage.deletePlaylist({ playlistId: Playlist });
  }

  playlistExist(playlistID) {
    return this.playlistStorage.playlistExist({ playlistID: Playlist });
  }
}
module.exports = PlaylistRepository;

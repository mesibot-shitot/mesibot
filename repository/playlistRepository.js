const {playlistHandler} = require('../DB/playlistHandler');

class PlaylistRepository {
    constructor() {
      this.playlistStorage = new playlistHandler('playlist'); 
    }

  fetchGroupPlaylists(id) {
    return this.playlistStorage.getGroupPlaylists();

  }

  getPlaylistById(playlistId) {
    return this.playlistStorage.getPlaylistById(playlistId);
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

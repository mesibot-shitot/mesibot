const {MongoStorage} = require('./mongoConnection');

class PlaylistRepository {
    constructor() {
      this.playlistStorage = new MongoStorage('playlist'); 
    }

    findSongs() {
        return this.songStorage.getSongs();
    }

    findPlaylists() {
        return this.playlistStorage.getPlaylists();
    }

    findUsers() {
        return this.userStorage.getUsers();
    }

    getSongId(songId) {
        return this.songStorage.findSongs({ id: songId });
    }

    getplaylistId(playlistId) {
        return this.playlistStorage.findPlaylists({ id: playlistId });
    }

    getuserId(userId) {
        return this.userStorage.findUsers({ id: userId });
    }

    createSong(Song) {
        return this.songStorage.createSong(Song);
    }

    createPlaylist(Playlist) {
        return this.playlistStorage.createPlaylist(Playlist);
    }

    createUser(User) {
        return this.userStorage.createUser(User);
    }

    updateSong(songId, Song) {
        return this.songStorage.updateSong({ songId }, Song);
    }

    updatePlaylist(playlistId, Playlist) {
        return this.playlistStorage.updatePlaylist({ playlistId }, Playlist);
    }

    updateUser(userId, User) {
        return this.userStorage.updateUser({ userId }, User);
    }

    deleteSong(songId) {
        return this.songStorage.deleteSong({ songId: Song });
    }

    deletePlaylist(playlistId) {
        return this.playlistStorage.deletePlaylist({ playlistId: Playlist });
    }

    deleteUser(userId) {
        return this.userStorage.deleteUser({ userId: User });
    }

    songExist(songID) {
        return this.songStorage.songExist({ songID: Song });
    }

    playlistExist(playlistID) {
        return this.playlistStorage.playlistExist({ playlistID: Playlist });
    }

    userExist(userID) {
        return this.userStorage.userExist({ userID: User });
    }
  }
module.exports = PlaylistRepository;
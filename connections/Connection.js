const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const Playlist = require('../Playlist');
const PlaylistRepository = require('../repository/playlistRepository');
const StatRepository = require('../repository/statRepository');
const Song = require('../Song');

const playlistDB = new PlaylistRepository();
const statDB = new StatRepository();
class Connection {
  playlist = null;

  constructor(interaction, load = false, playlistId = null) {
    this.group = interaction.guildId;
    this.createConnection(interaction, load, playlistId);
  }

  async createConnection(interaction, load = false, playlistId = null) {
    this.connection = joinVoiceChannel({
      channelId: interaction.channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    this.connection.subscribe(player);
    const group = { id: interaction.guildId, owner: interaction.guild.ownerId };
    if (load) {
      this.loadPlaylist(playlistId, group, player);
    } else {
      const newPlaylist = await playlistDB.createPlaylist({
        groupId: this.group,
        name: 'default',
        queue: [],
        playedList: [],
        owner: group.owner,
      });
      const { _id } = newPlaylist;
      await statDB.createAction({
        groupId: this.group,
        action: 'playlistCreated',
        playlist: _id,
      });
      this.playlist = new Playlist(player, group, _id);
    }
    console.log(`Bot connected to #${this.group} group!`);
  }

  async loadPlaylist(id, group, player) {
    const imported = await playlistDB.getPlaylistById(id);
    if (imported?.queue) {
      const { _id } = imported;
      this.playlist = new Playlist(player, group, _id);
      console.log('imported queue', imported.queue);
      imported.queue.forEach((song) => {
        const {
          title,
          url,
          thumbnail,
          duration,
          requestedBy,
          songId,
          priority,
          place,
        } = song;
        const newSong = new Song({
          title,
          url,
          thumbnail,
          duration,
          requestedBy,
          songId,
          priority,
          place,
        });
        this.playlist.pushToQueue(newSong);
      });
      this.playlist.playedList = imported.playedList;
      this.playlist.name = imported.name;
      this.playlist.id = _id;
      await statDB.createAction({
        groupId: this.group,
        action: 'playlistImported',
        playlist: _id,
      });
      console.log(`Playlist '${imported.name}' loaded from DB`);
    } else {
      console.error('Could not load playlist from DB, playlist is empty or does not exist');
    }
  }

  normalizePlaylist() {
    return {
      isDraft: false,
      groupId: this.group,
      owner: this.playlist.owner,
      name: this.playlist.name,
      queue: this.playlist.queue._elements,
      playedList: this.playlist.playedList,
    };
  }

  setPlaylistName(name) {
    this.playlist.name = name;
  }

  async savePlaylist() {
    await playlistDB.updatePlaylist(this.playlist.id, this.normalizePlaylist());
    await this.savePlaylistStat();
  }

  async deletePlaylist(id) {
    await playlistDB.deletePlaylist(id);
  }

  async fetchPlaylistName(name) {
    return playlistDB.fetchGroupPlaylist(this.group, name);
  }

  async savePlaylistStat() {
    return statDB.createAction({
      groupId: this.group,
      action: 'playlistSaved',
      playlist: this.playlist.id,
    });
  }

  disconnect() {
    this.connection.destroy();
  }

  async discardPlaylist() {
    return statDB.createAction({
      groupId: this.group,
      action: 'playlistDiscarded',
      playlist: this.playlist.id,
    });
  }

  async removeSongFromPlaylist(songPlace) {
    return this.playlist.removeByPlace(songPlace);
  }

  getSongByPlace(place) {
    return this.playlist.getPlace(place);
  }

  async voteSong(songPlace, userId, vote) {
    return this.playlist.voteForSong(songPlace, userId, vote); // todo try catch
  }
}
module.exports = Connection;

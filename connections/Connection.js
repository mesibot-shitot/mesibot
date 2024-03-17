const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const User = require('../User');
const Playlist = require('../Playlist');
const PlaylistRepository = require('../repository/playlistRepository');
const statRepository = require('../repository/statRepository');
const Song = require('../Song');

const playlistDB = new PlaylistRepository();
const statDB = new statRepository();
class Connection {
  playlist = null;

  members = []; // todo for statistics

  constructor(interaction, load = false, playlistId = null) {
    this.group = interaction.guildId;
    // this.getMembers(interaction);
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
    // todo change here when working on loading playlist from DB
    // todo check playlist parameters
    if (load) {
      this.loadPlaylist(playlistId, player);
    } else {
      const newPlaylist = await playlistDB.createPlaylist({ groupId: this.group, name: 'default', queue: [], playedList: [] });
      const { _id } = newPlaylist;
      this.playlist = new Playlist(player, this.group, _id);
    }
    console.log(`Bot connected to #${this.group} group!`);
  }

  getMembers(interaction) {
    const { members } = interaction;
    members.forEach((member) => { // todo add get user from DB
      const user = new User({ id: member.id, name: member.user.username });

      this.members.push(user);
    });
  }

  async loadPlaylist(id, player) {
    const imported = await playlistDB.getPlaylistById(id);
    if (imported?.queue) {
      this.playlist = new Playlist(player, this.group, imported._id);
      imported.queue.forEach((song) => {
        const {
          title, url, thumbnail, duration, requestedBy, songId, priority, place,
        } = song;
        const newSong = new Song({
          title, url, thumbnail, duration, requestedBy, songId, priority, place,
        });
        this.playlist.addTrack(newSong);
      });
      this.playlist.playedList = imported.playedList;
      this.playlist.name = imported.name;
      this.playlist.id = imported._id;
    } else {
      console.error('Could not load playlist from DB, playlist is empty or does not exist');
    }
  }

  nornalizePlaylist() {
    return {
      isDraft: false,
      groupId: this.group,
      name: this.playlist.name,
      queue: this.playlist.queue._elements,
      playedList: this.playlist.playedList,
    };
  }

  setPlaylistName(name) {
    this.playlist.name = name;
  }

  savePlaylist() {
    return playlistDB.updatePlaylist(this.playlist.id, this.nornalizePlaylist());
  }

  async fetchPlaylistName(name) {
    return playlistDB.fetchGroupPlaylist(this.group, name);
  }

  async updatePlaylist() {
    const newPlaylist = this.nornalizePlaylist();
    console.log(await playlistDB.updatePlaylist(this.playlist.id, newPlaylist));
  }

  disconnect() {
    this.connection.destroy();
  }
}
module.exports = Connection;

const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const User = require('../User');
const Playlist = require('../Playlist');
const PlaylistRepository = require('../repository/playlistRepository');
const Song = require('../Song');

const playlistDB = new PlaylistRepository();
class Connection {
  playlist = null;

  members = []; // todo for statistics

  constructor(interaction, load = false, playlistId = null) {
    this.group = interaction.guildId;
    // this.getMembers(interaction);
    this.createConnection(interaction, load, playlistId);
  }

  createConnection(interaction, load = false, playlistId = null) {
    this.connection = joinVoiceChannel({
      channelId: interaction.channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    this.connection.subscribe(player);
    // todo change here when working on loading playlist from DB
    this.playlist = new Playlist(player, interaction.guildId);
    // todo check playlist parameters
    if (load) {
      this.loadPlaylist(playlistId);
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

  async loadPlaylist(id) {
    const imported = await playlistDB.getPlaylistById(id);
    if (imported?.queue) {
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
    } else {
      console.error('Could not load playlist from DB, playlist is empty or does not exist');
    }
  }

  nornalizePlaylist() {
    return {
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
    // todo save playlist to DB
    this.nornalizePlaylist();
    return playlistDB.createPlaylist(this.nornalizePlaylist());
  }

  async updatePlaylist() {
    const playlist = await playlistDB.fetchGroupPlaylist(this.group, this.playlist.name);// todo try catch
    const { _id } = playlist[0];
    // console.log(_id);
    const newPlaylist = this.nornalizePlaylist();
    console.log(await playlistDB.updatePlaylist(_id, newPlaylist));
  }

  disconnect() {
    this.connection.destroy();
  }
}
module.exports = Connection;

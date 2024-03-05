const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const User = require('../User');
const Playlist = require('../Playlist');
// const PlaylistRepository = require('../repository/PlaylistRepository');

// const playlistDB = new PlaylistRepository();
class Connection {
  playlists = [];

  playlist = null;

  members = []; // todo for statistics

  constructor(interaction) {
    this.group = interaction.guildId;
    // this.getMembers(interaction);
    this.createConnection(interaction);
  }

  createConnection(interaction) {
    this.connection = joinVoiceChannel({
      channelId: interaction.channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    this.connection.subscribe(player);
    // todo change here when working on loading playlist from DB
    this.playlist = new Playlist(player);
    console.log(`Bot connected to #${this.group} group!`);
  }

  getMembers(interaction) {
    const { members } = interaction;
    members.forEach((member) => { // todo add get user from DB
      const user = new User({ id: member.id, name: member.user.username });

      this.members.push(user);
    });
  }

  getPlaylist() {

    // todo get playlists by group from DB
  }

  savePlaylist() {
    // todo save playlist to DB
  }

  disconnect() {
    this.connection.destroy();
  }
}
module.exports = Connection;

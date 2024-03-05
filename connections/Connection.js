const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const User = require('../User');
const Playlist = require('../Playlist');
const PlaylistRepository = require('../repository/playlistRepository');

const playlistDB = new PlaylistRepository();
class Connection {
  playlists = [];

  playlist = null;

  members = []; // todo for statistics

  constructor(interaction) {
    this.group = interaction.guildId;
    // this.getMembers(interaction);
    this.createConnection(interaction);
  }

  createConnection(interaction, load = false, playlist = null) {
    this.connection = joinVoiceChannel({
      channelId: interaction.channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    this.connection.subscribe(player);
    // todo change here when working on loading playlist from DB
    if (load) {
      this.playlist = playlist;
    } else
    this.playlist = new Playlist(player, interaction.guildId, 'default');
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
    playlistDB.findPlaylists(this.group);
  }

  savePlaylist() {
    // todo save playlist to DB
    const playlist = {
      groupID: this.group,
      name: this.playlist.name,
      queue: this.playlist.queue._elements,
      playedList: this.playlist.playedList,
    
    };
      playlistDB.createPlaylist(playlist);
  }

  disconnect() {
    this.connection.destroy();
  }
}
module.exports = Connection;

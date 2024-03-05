const { joinVoiceChannel, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const Connection = require('./Connection');
const Playlist = require('../Playlist');
const PlaylistRepository = require('../repository/playlistRepository');

const playlistDB = new PlaylistRepository();
class ConnectionManager {
  constructor() {
    this.connections = [];
  }

  async addConnection(interaction, load = false, playlist = null) {
    const { channel } = interaction.member.voice;
    if (!channel) {
      await interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
      return;
    }

    if (getVoiceConnection(interaction.guildId)) {
      await interaction.reply({ content: 'There is already a connection for this group.', ephemeral: true });
    }
    const connection = new Connection(interaction, load, playlist);
    this.connections.push(connection);

    //  todo check if connection exists in database
  }

  fetchGroupPlaylists(id) { 
    return playlistDB.fetchGroupPlaylists(id);
  }


  findConnection(id) {
    return this.connections.find((c) => c.group === id);
  }

  savePlaylist(id) {
    const connection = this.findConnection(id);
    if (!connection) throw new Error('Connection not found'); // todo change to custom error
    connection.savePlaylist();
  }

  removeConnection(id) {
    const connection = this.findConnection(id);
    if (!connection) throw new Error('Connection not found'); // todo change to custom error
    connection.disconnect();
    this.connections = this.connections.filter((c) => c.group !== id);
  }

  broadcast(data) {
    this.connections.forEach((c) => c.send(data));
  }
}
module.exports = ConnectionManager;

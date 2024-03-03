const User = require('../User');

class Connection {
  playlists = [];

  members = [];

  constructor(interaction) {
    this.connection = null;
    this.group = interaction.guildId;
    this.channel = interaction.member.voice.channel;
    this.getMembers(interaction);
  }

  connect() {
    this.connection = new Connection();
  }

  getMembers(interaction) {
    const { members } = interaction;
    members.forEach((member) => { // todo add get user from DB
      const user = new User({ id: member.id, name: member.user.username });

      this.members.push(user);
    });
  }

  disconnect() {
    this.connection = null;
  }
}
module.exports = Connection;

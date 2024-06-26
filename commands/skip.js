const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skip the current song.'),
  execute: async ({ interaction, connectionManager }) => {
    const { playlist } = connectionManager.findConnection(interaction.guildId);
    if (!playlist.queue) {
      await interaction.reply({ content: 'there is no song playlist.', ephemeral: true });
      return;
    }
    const embed = new EmbedBuilder();
    if (playlist.queue.isEmpty()) {
      embed.setTitle('You can`t skip this is the last song, add another song to skip');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    if (!playlist.player.playing) {
      interaction.reply({ content: 'You can`t skip there is no song playing', ephemeral: true });
      return;
    }
    const { channel } = interaction.member.voice;
    const existingUser = await playlist.checkUserSkip(interaction.user.id, interaction.user.username);
    if (existingUser) {
      interaction.reply({ content: 'You\'ve already voted to skip this song', ephemeral: true });
      return;
    }
    playlist.current.setskip(interaction);
    if ((playlist.current.skipc.length) >= Math.floor(channel.members.size / 2)) {
      playlist.skip();
      embed.setTitle('skipped');
      embed.setDescription(`now playing **${playlist.current.title}**`);
      interaction.reply({ embeds: [embed] });
      return;
    }
    const sum = Math.ceil((channel.members.size / 2) - (playlist.current.skipc.length));
    await interaction.reply({ content: `You need ${sum} more members to skip this song`, ephemeral: true });
  },

};

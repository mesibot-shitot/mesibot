const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skip the current song.'),
  execute: async ({ interaction, connectionManager }) => {
    const { playlist } = connectionManager.findConnection(interaction.guildId);
    if (!playlist.queue) {
      await interaction.reply('there is no song playlist.');
      return;
    }
    const embed = new EmbedBuilder();
    if (playlist.queue.isEmpty()) {
      embed.setTitle('You can`t skip this is the last song, add another song to skip');
      interaction.reply({ embeds: [embed] });
      return;
    }
    const { channel } = interaction.member.voice;
    const existingUser = playlist.current.getUserSkip(interaction.user.id);
    if (existingUser) {
      interaction.reply('You\'ve already voted to skip this song');
      return;
    }
    playlist.current.setskip(interaction);
    if ((playlist.current.skipc.length) === Math.ceil(channel.members.size / 2) - 1) {
      playlist.skip();
      embed.setTitle('skipped');
      embed.setDescription(`now playing **${playlist.current.title}**`);
      interaction.reply({ embeds: [embed] });
      return;
    }
    const sum = Math.ceil((channel.members.size / 2) - (playlist.current.skipc.length));
    // eslint-disable-next-line no-template-curly-in-string
    await interaction.reply(`You need ${sum} more members to skip this song`);
    // embed.setThunbnail(playlist.current.thumbnail);
  },

};

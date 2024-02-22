const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skip the current song.'),
  execute: async ({ interaction, playlist }) => {
    if (!playlist.queue) {
      await interaction.reply('there is no song playlist.');
      return;
    }
    playlist.skip();
    const embed = new EmbedBuilder();
    embed.setTitle('skipped');
    embed.setDescription(`now playing **${playlist.current.title}**`);
    // embed.setThunbnail(playlist.current.thumbnail);
    interaction.reply({ embeds: [embed] });
  },

};

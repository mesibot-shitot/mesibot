const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skip the current song.'),
  execute: async ({ interaction, playlist }) => {
    if (!playlist.queue.size()) {
      const embed = new EmbedBuilder(); // FIXME when skiping last song the music wont stop playing
      embed.setTitle('Ops...');
      embed.setDescription('***Queue is empty***');
      embed.setColor('#ff0000');
      await interaction.reply({ embeds: [embed] });
      return;
    }
    playlist.skip();
    const embed = new EmbedBuilder();
    embed.setTitle('skipped');
    embed.setDescription(`now playing **${playlist.current.title}**`);
    embed.setColor('#9747FF');
    // embed.setThunbnail(playlist.current.thumbnail);
    interaction.reply({ embeds: [embed] });
  },

};

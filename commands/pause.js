const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('pauses the current song.'),
  execute: async ({ interaction, playlist }) => {
    if (!playlist.player.playing) {
      await interaction.reply('there is no song playing.');
      return;
    }
    playlist.player.pause();
    await interaction.reply(' the song paused');
  },

};

const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('pauses the current song.'),
  execute: async ({ interaction, player }) => {
    player.pause();
    await interaction.reply(' the song paused');
  },

};

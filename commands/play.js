const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
// const { QueryType } = require("discord-player")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play a song.'),
  execute: async ({ interaction, playlist }) => {
    if (!interaction.member.voice.channel) {
      await interaction.reply('you must be in a voice channel to use this command.');
      return;
    }
    try {
      if (!playlist.player.playing) await playlist.playSong();
      await interaction.reply({
        content: `playing ${playlist.current.title}`,
      });
    } catch (err) {
      const enmbed = new EmbedBuilder();
      enmbed.setTitle('THERE WAS A COMPLICATION TRYING TO PLAY THE SONG');
      enmbed.setColor('#ff0000');
      enmbed.setDescription('Skiping the song');
    }
  },
};

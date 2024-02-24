const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const Playlist = require('../Playlist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Choose song to Upvote or Downvote.')
    .addStringOption((option) => option
      .setName('song-number')
      .setDescription('Song`s number in queue.')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('vote')
      .setDescription('choose weather to Upvote or Downvote')
      .addChoices(
        { name: '👍', value: 'UP' },
        { name: '👎', value: 'DOWN' },
      )
      .setRequired(true)),
  execute: async ({ interaction, playlist }) => {
    const songNum = interaction.options.getString('song-number') - 1;
    const queue = playlist.queue._elements;
    if (songNum < 0 || songNum > playlist.queue.size()) {
      interaction.reply({ content: 'Invalid number', ephemeral: true });
      return;
    }
    queue[songNum].setVote(interaction);
    playlist.reorderQueue();
    console.log('queue reorderd!');
  },
};

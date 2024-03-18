const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow, MessageButton, EmbedBuilder, VoiceChannel,
} = require('discord.js');
const Playlist = require('../Playlist');
const Song = require('../Song');

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
  execute: async ({ interaction, connectionManager }) => {
    const { playlist } = connectionManager.findConnection(interaction.guildId);
    const songNum = interaction.options.getString('song-number') - 1;
    const queue = playlist.queue._elements;
    if (songNum < 0 || songNum > playlist.queue.size() || !Number.isInteger(songNum)) {
      interaction.reply({ content: 'Invalid number', ephemeral: true });
      return;
    }
    const message = queue[songNum].setVote(interaction);
    const { channel } = interaction.member.voice;
    if ((queue[songNum].disLikeCount()) === Math.ceil(channel.members.size / 2)) {
      const name = queue[songNum].title;
      const songId = queue[songNum].songId;
      queue.splice(songNum, 1);
      await playlist.songRemoved(name, songId);
      await interaction.reply(`${name} was removed from queue`);
    } else {
      interaction.reply({ content: `${message}`, ephemeral: true });
    }
    playlist.reorderQueue();
  },
};

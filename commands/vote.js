const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow, MessageButton, EmbedBuilder, VoiceChannel,
} = require('discord.js');
const Playlist = require('../Playlist');
const displayqueue = require('./displayqueue');

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
    if (songNum < 0 || songNum > playlist.queue.size() || !Number.isInteger(songNum)) {
      interaction.reply({ content: 'Invalid number', ephemeral: true });
      return;
    }
    const message = queue[songNum].setVote(interaction);
    const { channel } = interaction.member.voice;
    if ((queue[songNum].disLikeCount()) === Math.ceil(channel.members.size / 2)) {
      console.log(queue[songNum].disLikeCount());
      const name = queue[songNum].title;
      queue.splice(songNum, 1);
      await interaction.reply(`${name} was removed from queue`);
    } else {
      interaction.reply({ content: `${message}`, ephemeral: true });
    }
    playlist.reorderQueue();
    // try {
    //   const embed = await displayqueue.execute({ interaction, playlist });
    //   if (!interaction.replied) {
    //     await interaction.followUp({ embeds: [embed] });
    //   } else {
    //     await interaction.followUp({ embeds: [embed] });
    //   }
    //   console.log('Queue reordered and displayed.');
    // } catch (error) {
    //   console.error('Error displaying queue:', error);
    //   await interaction.followUp({ content: 'There was an error displaying the queue.', ephemeral: true });
    // }
  },
};

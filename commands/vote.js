const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow, MessageButton, EmbedBuilder, VoiceChannel,
} = require('discord.js');
const Playlist = require('../Playlist');

const VOTE = {
  UP: 1,
  DOWN: -1,
};
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
    let songNum = interaction.options.getString('song-number');
    const queue = playlist.queue._elements;
    if (songNum < 0 || songNum > playlist.queue.size() || isNaN(songNum)) {
      interaction.reply({ content: 'Invalid number', ephemeral: true });
      return;
    }
    songNum -= 1;

    try {
      const message = setVote(interaction, queue[songNum]);
      const { channel } = interaction.member.voice;
      if ((queue[songNum].disLikeCount()) === Math.ceil(channel.members.size / 2)) {
        const name = queue[songNum].title;
        queue.splice(songNum, 1);
        await interaction.reply(`${name} was removed from queue`);
      } else {
        interaction.reply({ content: `${message}`, ephemeral: true });
      }
      playlist.reorderQueue();
    } catch (erorr) {
      console.log(erorr);
    }
  },
};
const setVote = (interaction, song) => {
  const existingUser = song.getUserVote(interaction.user.id);
  const voteExtract = interaction.options.getString('vote');
  const newVote = VOTE[voteExtract];
  let message;
  if (existingUser) {
    if (existingUser.vote === newVote) {
      message = 'You already voted for this song'; // todo pop user out of vote list as if he never voted
      return message;
    }
    existingUser.vote = newVote;
    message = 'You have changed your vote';
    song.priority += (newVote * 2);
    return message;
  }
  // eslint-disable-next-line max-len
  const newUser = { user: interaction.user.id, vote: newVote }; // todo: check if this is the right way to get the user id
  song.vote.push(newUser);

  message = 'Vote registered';
  song.priority += newVote;
  return message;
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow, MessageButton, EmbedBuilder, VoiceChannel,
} = require('discord.js');
const Playlist = require('../Playlist');
const Song = require('../Song');
const { connection } = require('mongoose');

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
    const connection = connectionManager.findConnection(interaction.guildId);
    const { playlist } = connection;
    let songNum = interaction.options.getString('song-number');
    //const queue = playlist.queue._elements;
    if (songNum < 0 || songNum > playlist.queue.size() || Number.isNaN(songNum)) {
      interaction.reply({ content: 'Invalid number', ephemeral: true });
      return;
    }
    songNum -= 1;

    try {
      const song = connection.getSongByIndex(songNum);
      const message = await setVote(interaction, song, connection);
      const { channel } = interaction.member.voice;
      if ((song.disLikeCount()) === Math.ceil(channel.members.size / 2)) {
        await connection.removeSongFromPlaylist(songNum);
        await interaction.reply(`${song.title} was removed from queue`);
      } else {
        interaction.reply({ content: `${message}`, ephemeral: true });
      }
      playlist.reorderQueue();
    } catch (erorr) {
      console.log(erorr);
    }
  },
};
const setVote = async (interaction, song, connection) => {
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
    await connection.voteSong(song, interaction.user.id, newVote);
    return message;
  }
  // eslint-disable-next-line max-len
  const newUser = { user: interaction.user.id, vote: newVote }; // todo: check if this is the right way to get the user id
  song.vote.push(newUser);

  message = 'Vote registered';
  song.priority += newVote;
  await connection.voteSong(song, interaction.user.id, newVote);
  return message;
};

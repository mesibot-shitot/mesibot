const { SlashCommandBuilder } = require('@discordjs/builders');

const VOTE = {
  UP: 1,
  DOWN: -1,
};
const setVote = async (interaction, song, connection) => {
  const voteExtract = interaction.options.getString('vote');
  const newVote = VOTE[voteExtract];
  const action = await connection.voteSong(song, interaction.user.id, newVote);
  if (!action) return 'You already voted for this song';
  if (action < 0) return 'You have changed your vote';
  return 'Vote registered';
};
const command = {
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
    const songPlace = interaction.options.getString('song-number');
    const song = connection.getSongByPlace(songPlace);
    if (songPlace < 0 || !song || songPlace > playlist.queue.size() + playlist.playedList.length || Number.isNaN(songPlace)) {
      interaction.reply({ content: 'Invalid number', ephemeral: true });
      return;
    }
    try {
      const message = await setVote(interaction, songPlace, connection);
      const { channel } = interaction.member.voice;
      if ((song.disLikeCount()) === Math.ceil(channel.members.size / 2)) {
        await connection.removeSongFromPlaylist(songPlace);
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
module.exports = command;

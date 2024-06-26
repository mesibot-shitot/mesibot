const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
} = require('discord.js');
const { GetListByKeyword } = require('youtube-search-api');
const Song = require('../Song');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Plays a song in the voice channel.')
    .addStringOption((option) => option
      .setName('song')
      .setDescription('The name of the song to play.')
      .setRequired(true)),
  execute: async ({ interaction, connectionManager }) => {
    const connection = connectionManager.findConnection(interaction.guildId);
    const { playlist } = connection;
    const songName = interaction.options.getString('song');
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!songName) {
      interaction.reply({ content: 'Please provide a song name.', ephemeral: true });
      return;
    }
    try {
      const songInfo = await GetListByKeyword(`${songName} official audio`, false);
      if (!songInfo || songInfo.items.length === 0) {
        interaction.reply({ content: 'Song not found.', ephemeral: true });
        return;
      }
      const topResults = songInfo.items.slice(0, 5);

      const buttons = topResults.map((item, index) => new ButtonBuilder()
        .setLabel(`${item.title.split(' ').slice(0, 7).join(' ')}...`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`song_${index}`));

      const row = new ActionRowBuilder().addComponents(buttons);
      const userChoice = await interaction.reply({ content: 'Please select a song:', components: [row], ephemeral: true });
      const collector = userChoice.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15000,
      });
      collector.on('collect', async (buttonInteraction) => {
        if (playlist.queue.size() === 20) {
          const embed = new EmbedBuilder();
          embed.setTitle('Playlist is full, songs cannot be added');
          buttonInteraction.reply({ embeds: [embed] });
          return;
        }
        const index = parseInt(buttonInteraction.customId.split('_')[1], 10);
        const url = `https://www.youtube.com/watch?v=${topResults[index].id}`;
        const { title } = topResults[index];
        const songId = topResults[index].id;
        const { thumbnail } = topResults[index];
        const duration = topResults[index].length.simpleText;
        const requestedBy = { userId: member.user.id, userName: member.user.username };
        const newSong = new Song({
          title,
          url,
          thumbnail: thumbnail.thumbnails[0].url,
          duration,
          requestedBy,
          songId,
        });
        await playlist.newSong(newSong);
        buttonInteraction.reply(`**${topResults[index].title}** Was Added To The Playlist`);
      });
      collector.on('end', async () => {
        await interaction.editReply({ content: 'Action Timed Out', components: [] });
      });
    } catch (error) {
      console.error('Error playing song:', error);
      interaction.reply({ content: 'An error occurred while playing the song.', ephemeral: true });
    }
  },
};

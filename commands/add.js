const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType,
} = require('discord.js');
const ytdl = require('ytdl-core');
const { GetListByKeyword } = require('youtube-search-api');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Plays a song in the voice channel.')
    .addStringOption((option) => option
      .setName('song')
      .setDescription('The name of the song to play.')
      .setRequired(true)),
  execute: async ({ interaction, player }) => {
    const songName = interaction.options.getString('song');

    if (!songName) {
      interaction.reply({ content: 'Please provide a song name.', ephemeral: true });
      return;
    }
    try {
      const songInfo = await GetListByKeyword(songName, false);
      if (!songInfo || songInfo.items.length === 0) {
        interaction.reply({ content: 'Song not found.', ephemeral: true });
        return;
      }
      const topResults = songInfo.items.slice(0, 5);

      // Create buttons for each result
      const buttons = topResults.map((item, index) => new ButtonBuilder()
        .setLabel(`${item.title.split(' ').slice(0, 7).join(' ')}...`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`song_${index}`));

      // Create action row with buttons
      const row = new ActionRowBuilder().addComponents(buttons);
      const userChoice = await interaction.reply({ content: 'Please select a song:', components: [row], ephemeral: true });
      const collector = userChoice.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15000,
      });
      collector.on('collect', (buttonInteraction) => {
        const index = parseInt(buttonInteraction.customId.split('_')[1]);
        const songUrl = `https://www.youtube.com/watch?v=${topResults[index].id}`;
        const stream = ytdl(songUrl, { quality: 'highestaudio', format: 'audioonly' });
        const resource = createAudioResource(stream);
        player.play(resource);
        buttonInteraction.reply(`Now playing: **${topResults[index].title}**`);
      });
    } catch (error) {
      console.error('Error playing song:', error);
      interaction.reply({ content: 'An error occurred while playing the song.', ephemeral: true });
    }
  },
};

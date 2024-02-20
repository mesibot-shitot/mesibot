const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('display-queue')
    .setDescription('show the first 10 songs in the queue.'),
  execute: async ({ interaction, playlist }) => {
    const queue = playlist.queue._elements;
    console.log(queue);
    const songList = [];
    let index = 1;
    for (const song in queue) {
      const newSong = { name: `${index}`, value: `${queue[song].title}`, inline: false };
      index += 1;
      songList.push(newSong);
    }
    const embed = new EmbedBuilder();
    embed.setTitle('Queue');
    embed.setColor('#ff0000');
    embed.addFields(songList);
    embed.setTimestamp();
    embed.setDescription(queue[0].title);
    embed.setThumbnail(queue[0].thumbnail.thumbnails[0].url);
    interaction.reply({ embeds: [embed] });
  },
};

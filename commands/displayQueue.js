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
      // if (playlist.current == null && song == 0) { continue; }
      const newSong = { name: `${index}) priority: ${queue[song].priority}`, value: `${queue[song].title}`, inline: false };
      index += 1;
      songList.push(newSong);
    }
    // todo add every song as a link in the embed (for voting system)
    const embed = new EmbedBuilder();
    if (playlist.queue.size() === 0 &&playlist.current ==null) {
      // interaction.reply('The queue is empty');
      embed.setTitle('The queue is empty');
      embed.setColor('#ff0000');
      interaction.reply({ embeds: [embed] });
      return;
    }
    embed.setTitle('currently playing');
    embed.setColor('#9747FF');
    embed.addFields(songList);
    embed.setTimestamp();
    if (playlist.current != null) {
      embed.setDescription(playlist.current.title);
      embed.setThumbnail(playlist.current.thumbnail.thumbnails[0].url);
    } else {
      embed.setDescription(queue[0].title);
      embed.setThumbnail(queue[0].thumbnail.thumbnails[0].url);
    }
    interaction.reply({ embeds: [embed] });
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('display-queue')
    .setDescription('show the first 10 songs in the queue.'),
  execute: async ({ interaction, connectionManager }) => {
    const { playlist } = connectionManager.findConnection(interaction.guildId);
    const queue = playlist.queue._elements;
    const songList = [];
    let index = 1;
    queue.forEach((song) => {
      const newSong = {
        name: `${index}.  ${song.title}`, value: `added by: ${song.requestedBy.userName}\nVote Number: ${song.place}`, inline: false,
      };
      index += 1;
      songList.push(newSong);
    });
    const embed = new EmbedBuilder();
    if (playlist.queue.size() === 0 && playlist.current == null) {
      embed.setTitle('The queue is empty');
      embed.setColor('#ff0000');
      interaction.reply({ embeds: [embed] });
      return;
    }
    embed.setColor('#9747FF');
    embed.addFields(songList);
    embed.setTimestamp();
    if (playlist.current != null) {
      if (playlist.player.playing) {
        embed.setTitle('Currently playing:');
      } else {
        embed.setTitle('Currently paused:');
      }
      embed.setDescription(playlist.current.title);
      embed.setThumbnail(playlist.current.thumbnail);
    } else {
      embed.setTitle('Playing next:');
      embed.setDescription(queue[0].title);
      embed.setThumbnail(queue[0].thumbnail);
    }

    interaction.reply({ embeds: [embed] });
  },
};

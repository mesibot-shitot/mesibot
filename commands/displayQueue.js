const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('display-queue')
    .setDescription('show the first 10 songs in the queue.'),
  execute: async ({interaction, playlist }) => {
      const queue = playlist.queue._elements;
        const embed = new EmbedBuilder()
        .setTitle("Queue")
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter("this is the queue")
        .setDescription(queue.map((song, index)=>`**${index+1}.** ${song.title}`))
        .setThumbnail(queue[0].thumbnail);
        channel.send({embeds: [embed]});
    },
}


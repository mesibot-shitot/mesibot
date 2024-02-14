const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('display-queue')
    .setDescription('show the first 10 songs in the queue.'),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    if (queue || !queue.playing) {
      await interaction.reply('there is no song playing.');
      return;
    }
    const queueString = queue.tracks.slice(0, 10).map((song, i) => `(${i + 1}) [${song.duration}\n' ${song.title}- <@$(song.requestedBy.id}>`).join('\n');
    const currentSong = queue.current;
    await interaction.reply({
      ds: [
        new MessageEmbed()
          .setDescription(`**Currently playing:**\n' ${currentSong.title} - @${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
          .setThumbnail(currentSong.thumbail),
      ],

    });
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exit')
    .setDescription('exits the vocie channel.'),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue) {
      await interaction.reply('there is no song playlng.');
      return;
    }
    queue.destroy();
    await interaction.reply(' you bully me');
  },

};

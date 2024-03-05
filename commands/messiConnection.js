const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mesi')
    .setDescription('Invite Mesibot to the party!'),
  execute: async ({ interaction, connectionManager }) => {
    if (!getVoiceConnection(interaction.guildId)) {
      const owner = await interaction.guild.fetchOwner();
      if (owner.id !== interaction.user.id) {
        interaction.reply({ content: 'You must be a group creator to create a connection', ephemeral: true });
        return;
      }

      await connectionManager.addConnection(interaction);
      interaction.reply('Let\'s get this party started!');
    }
  },
};

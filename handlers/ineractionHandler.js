const slashInteraction = async (interaction, connectionManager, controller) => {
  if (!interaction.isCommand()) return;
  const { channel } = interaction.member.voice;
  if (!channel) {
    interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
    return;
  }
  if (!connectionManager.findConnection(interaction.guildId) && interaction.commandName !== 'mesi') {
    interaction.reply({ content: 'You need to connect the bot to a voice channel first.\n**Call mesi over with /mesi**', ephemeral: true });
    return;
  }
  try {
    await controller.doCommand(interaction, connectionManager);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

module.exports = { slashInteraction };

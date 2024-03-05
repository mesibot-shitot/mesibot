const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder,
} = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exit')
    .setDescription('Disconnect the MesiBot from the voice channel.'),
  execute: async ({ interaction, connectionManager }) => {
    const owner = await interaction.guild.fetchOwner();
    if (owner.id !== interaction.user.id) {
      interaction.reply({ content: 'You must be a group creator to use this command', ephemeral: true });
    }
    const save = new ButtonBuilder()
      .setCustomId('save')
      .setLabel('Save')
      .setStyle(ButtonStyle.Success);
    const dontSave = new ButtonBuilder()
      .setCustomId('dont save')
      .setLabel('Dont Save')
      .setStyle(ButtonStyle.Danger);
    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(cancel, dontSave, save);

    const userChoice = await interaction.reply({
      content: 'Do you want to save the playlist?',
      components: [row],
      ephemeral: true,
    });
    const collector = userChoice.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });
    collector.on('collect', async (buttonInteraction) => {
      let content = '';
      if (buttonInteraction.customId === 'cancel') {
        await buttonInteraction.update({ content: 'Disconnect canceled', ephemeral: true, components: [] });
        return;
      }

      if (buttonInteraction.customId === 'save') {
        connectionManager.savePlaylist(interaction.guildId);
        //playlist.savePlaylist(); // todo function and try catch
        content = 'Playlist saved';
      }
      if (buttonInteraction.customId === 'dont save') {
        content = 'Disconnecting, playlist discarded';
      }
      connectionManager.removeConnection(interaction.guildId);
      await buttonInteraction.update({ content, ephemeral: true, components: [] });
    });
  },
};

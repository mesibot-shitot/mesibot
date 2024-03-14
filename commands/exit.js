const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder, ModalBuilder,
  TextInputBuilder, TextInputStyle,
} = require('discord.js');

const save = new ButtonBuilder()
  .setCustomId('save')
  .setLabel('Save')
  .setStyle(ButtonStyle.Success);
const cancel = new ButtonBuilder()
  .setCustomId('cancel')
  .setLabel('Cancel')
  .setStyle(ButtonStyle.Secondary);
const dontSave = new ButtonBuilder()
  .setCustomId('dont save')
  .setLabel('Dont Save')
  .setStyle(ButtonStyle.Danger);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exit')
    .setDescription('Disconnect the MesiBot from the voice channel.'),
  execute: async ({ interaction, connectionManager }) => {
    const owner = await interaction.guild.fetchOwner();
    if (owner.id !== interaction.user.id) {
      interaction.reply({ content: 'You must be a group creator to use this command', ephemeral: true });
      return;
    }
    const connection = connectionManager.findConnection(interaction.guildId);
    if (!connection) {
      interaction.reply({ content: 'There is no connection to disconnect', ephemeral: true });
      return;
    }

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
      // buttonInteraction.deferUpdate();
      const { customId } = buttonInteraction;
      if (customId === 'save') {
        if (!connection.playlist.name) {
          const modal = new ModalBuilder()
            .setCustomId('Save Playlist')
            .setTitle('Save Playlist');
          const NameInput = new TextInputBuilder()
            .setCustomId('playlistName')
            .setLabel('Name Your New Playlist')
            .setPlaceholder('Enter Playlist Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
          const NameRaw = new ActionRowBuilder().addComponents(NameInput);
          modal.addComponents(NameRaw);
          await buttonInteraction.showModal(modal);
          // await buttonInteraction.update({ content: 'Playlist saved', components: [] });
          return;
        }
        await connection.updatePlaylist();
        connectionManager.removeConnection(interaction.guildId);
        await buttonInteraction.update({ content: 'Playlist updated', components: [] });
        return;
      }
      if (customId === 'dont save') {
        connectionManager.removeConnection(interaction.guildId);
        await buttonInteraction.update({ content: 'Playlist not saved', components: [] });
        return;
      }
      await buttonInteraction.update({ content: 'Ho You\'re Staying! How Fun  :partying_face: ', components: [] });
    });
  },
};

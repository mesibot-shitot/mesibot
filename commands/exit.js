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
      let content = '';
      const { customId } = buttonInteraction;
      if (customId === 'cancel') {
        await buttonInteraction.update({ content: 'Ho You\'re Staying! How Fun  :partying_face: ', components: [] });
        return;
      }
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
          await interaction.editReply({ content: 'Saving...', components: [] });
          await buttonInteraction.showModal(modal);
          const filter = (submit) => submit.customId === 'Save Playlist';
          // todo handle error
          const success = await buttonInteraction.awaitModalSubmit({ filter, time: 15_000 })
            .then((d) => console.log(d))
            .catch((error) => console.error(error));
          if (!success) return;
          connectionManager.removeConnection(interaction.guildId);
          return;
        }
        await connection.updatePlaylist();
        content = 'Playlist updated';
      }
      if (customId === 'dont save') {
        content = 'Playlist was not saved';
      }
      connectionManager.removeConnection(interaction.guildId);
      await buttonInteraction.update({ content, components: [] });
    });
    // collector.on('end', async (collected) => {
    //   // Remove buttons after timeout or interaction completes
    //   if (collected.size === 0) {
    //     await interaction.editReply({ content: 'Selection timed out', components: [] });
    //   }
    // });
  },
};

const handleModalSubmit = async (modalInteraction, connection) => {
  const name = modalInteraction.fields.getTextInputValue('playlistName');
  const isExisting = await connection.fetchPlaylistName(name);
  if (isExisting) {
    modalInteraction.reply({ content: 'A Playlist with this name already exists \nPlease try again   :x:', ephemeral: true });
    return false;
  }
  connection.setPlaylistName(name);
  connection.savePlaylist();
  await modalInteraction.reply({ content: `Playlist  **'${name}'**  was saved   :white_check_mark:`, components: [], ephemeral: true });
  return true;
};

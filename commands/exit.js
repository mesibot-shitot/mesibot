const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ModalBuilder,
  TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
} = require('discord.js');
const { handleModalSubmit } = require('../handlers/modalHendler');

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
const deleteplaylist = new ButtonBuilder()
  .setCustomId('delete playlist')
  .setLabel('Delete Playlist')
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

    const buttonRow = new ActionRowBuilder()
      .addComponents(cancel, dontSave, save);
    const buttonRow2 = new ActionRowBuilder()
      .addComponents(cancel, deleteplaylist);
    const playlists = await connectionManager.fetchGroupPlaylists(interaction.guildId);
    let userChoice;
    if (playlists.length >= 25) {
      userChoice = await interaction.reply({
        content: 'It is not possible to add another playlist, the limit is 25,you can delete playlist ',
        components: [buttonRow2],
        ephemeral: true,
      });
    } else {
      userChoice = await interaction.reply({
        content: 'Do you want to save the playlist?',
        components: [buttonRow],
        ephemeral: true,
      });
    }
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
      if (customId === 'delete playlist') {
        const select = new StringSelectMenuBuilder();
        select.setCustomId('playlist');
        select.setPlaceholder('Select a playlist');
        if (!playlists.length) {
          await buttonInteraction.update({ content: 'No playlists found  :x: ', ephemeral: true, components: [] });
          return;
        }
        const filteredPlaylists = playlists.filter((playlist) => playlist.name !== '');
        select.addOptions(filteredPlaylists.map((playlist) => new StringSelectMenuOptionBuilder()
          .setLabel(playlist.name)
          .setValue(playlist._id.toString())));
        const row = new ActionRowBuilder().addComponents(select);
        const reply = await buttonInteraction.update({ content: 'Please select a playlist:', components: [row], ephemeral: true });
        const selectCollector = reply.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          time: 15000,
        });
        selectCollector.on('collect', async (selectInteraction) => {
          const playlistIdToDelete = selectInteraction.values[0];
          await connection.deletePlaylist(playlistIdToDelete);
          await selectInteraction.update({ content: 'Playlist deleted', ephemeral: true, components: [] });
        });
        return;
      }

      if (customId === 'save') {
        if (connection.playlist.name === '' || connection.playlist.name === 'default') {
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
          const success = await interaction.awaitModalSubmit({ filter, time: 15_000 })
            .then((modalInteraction) => handleModalSubmit(modalInteraction, connection))
            .catch(async () => {
              await interaction.editReply({ content: 'Playlist Was Not Saved', components: [] });
              return false;
            });
          if (!success) return;
          connectionManager.removeConnection(interaction.guildId);
          return;
        }
        await connection.savePlaylist();
        content = 'Playlist updated';
      }
      if (customId === 'dont save') {
        content = 'Playlist was not saved';
        await connection.discardPlaylist();
      }
      connectionManager.removeConnection(interaction.guildId);
      await buttonInteraction.update({ content, components: [] });
    });
    collector.on('end', async () => {
      await interaction.editReply({ content: 'Action Timed Out', components: [] });
    });
  },
};

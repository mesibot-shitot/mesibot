const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType,
  StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
} = require('discord.js');

const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mesi')
    .setDescription('Invite Mesibot to the party!'),
  execute: async ({ interaction, connectionManager }) => {
    if (getVoiceConnection(interaction.guildId)) {
      interaction.reply({ content: 'MesiBot is already connected to a voice channel', ephemeral: true });
      return;
    }
    const owner = await interaction.guild.fetchOwner();
    if (owner.id !== interaction.user.id) {
      interaction.reply({ content: 'You must be a group creator to create a connection', ephemeral: true });
      return;
    }

    const importPlaylist = new ButtonBuilder()
      .setCustomId('import')
      .setLabel('Import')
      .setStyle(ButtonStyle.Primary);
    const newPlaylist = new ButtonBuilder()
      .setCustomId('new playlist')
      .setLabel('New Playlist')
      .setStyle(ButtonStyle.Primary);

    const buttonRow = new ActionRowBuilder()
      .addComponents(importPlaylist, newPlaylist);

    const userChoice = await interaction.reply({
      content: 'Do you want to save the playlist?',
      components: [buttonRow],
      ephemeral: true,
    });

    const collector = userChoice.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });
    collector.on('collect', async (buttonInteraction) => {
      const { customId } = buttonInteraction;
      if (customId === 'import') {
        const select = new StringSelectMenuBuilder();
        select.setCustomId('playlist');
        select.setPlaceholder('Select a playlist');
        const playlists = await connectionManager.fetchGroupPlaylists(interaction.guildId);
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
          const playlist = playlists.find((p) => p._id.toString() === selectInteraction.values[0]);
          await connectionManager.addConnection(interaction, true, playlist);
          await selectInteraction.update({ content: 'Playlist imported', ephemeral: true, components: [] });
          await interaction.followUp('Let\'s get this party started!');
        });
      }

      if (buttonInteraction.customId === 'new playlist') {
        await connectionManager.addConnection(interaction, false);
        await buttonInteraction.update({ content: 'create new playlist', ephemeral: true, components: [] });
        await interaction.followUp('Let\'s get this party started!');
      }
    });
    collector.on('end', async () => {
      await interaction.editReply({ content: 'Action Timed Out', ephemeral: true, components: [] });
    });
  },
};

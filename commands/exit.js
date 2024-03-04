const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exit')
    .setDescription('Disconnect the bor from the voice channel.'),
  execute: async ({ interaction, playlist }) => {
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
    collector.on('collect', (buttonInteraction) => {
      let content = '';
      if (buttonInteraction.customId === 'cancel') {
        buttonInteraction.reply({ content: 'Playlist not saved', ephemeral: true });
      }
      if (buttonInteraction.customId === 'save') {
        // playlist.savePlaylist(); // todo function and try catch
        content = 'Playlist saved';
        interaction.guild.me.voice.disconnect();
      }
      if (buttonInteraction.customId === 'dont save') {
        content = 'Disconnect without saving the playlist';
      }
      buttonInteraction.reply({ content, ephemeral: true });
    });
  },
};

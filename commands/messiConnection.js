const {
  SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder,
} = require('discord.js');

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

      // connectionManager.fetchGroupPlaylists(interaction.guildId) // todo check if there are no playlists
      //   .then((playlists) => {
      //     const playlistNames = playlists.map((p) => p.name);
      //     const embed = new EmbedBuilder()
      //       .setColor('#0099ff')
      //       .setTitle('Group Playlists')
      //       .setDescription('Choose a playlist to import')
      //       .addFields(
      //         { name: 'Playlists', value: playlistNames.join('\n'), inline: true },
      //       );
      //     interaction.reply({ embeds: [embed] });
      //   });


      //   const importPlaylist = new ButtonBuilder()
      //   .setCustomId('import')
      //   .setLabel('Import')
      //   .setStyle(ButtonStyle.Primary);
      // const newPlaylist = new ButtonBuilder()
      //   .setCustomId('new playlist')
      //   .setLabel('New Playlist')
      //   .setStyle(ButtonStyle.Primary);

      //   const row = new ActionRowBuilder()
      //   .addComponents( importPlaylist, newPlaylist);

      // const userChoice = await interaction.reply({
      //   content: 'Do you want to save the playlist?',
      //   components: [row],
      //   ephemeral: true,
      // });

      // const collector = userChoice.createMessageComponentCollector({
      //   componentType: ComponentType.Button,
      //   time: 15000,
      // });
      // collector.on('collect', async (buttonInteraction) => {
      //   let content = '';

      //   if (buttonInteraction.customId === 'import') {
      //     connectionManager.savePlaylist(interaction.guildId);
      //     //playlist.savePlaylist(); // todo function and try catch
      //     content = 'Playlist imported';
      //   }
      //   if (buttonInteraction.customId === 'new playlist') {
      //     content = 'create new playlist';
      //   }
      //   connectionManager.removeConnection(interaction.guildId);
      //   await buttonInteraction.update({ content, ephemeral: true, components: [] });
      // });

      await connectionManager.addConnection(interaction, true, "65e7832238b00df51a158c4a");
      interaction.reply('Let\'s get this party started!');
    }
  },
};

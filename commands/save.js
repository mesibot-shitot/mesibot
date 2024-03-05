const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('save')
        .setDescription('Save the current queue.'),
    execute: async ({ interaction, playlist }) => {
        const queue = playlist.queue._elements;
        const songList = [];
        for (const song in queue) {
            const newSong = {
                name: `${queue[song].title}`, value: `added by: ${queue[song].requestedBy} priority:  ${queue[song].priority} place: ${queue[song].place}`, inline: false,
            };
            songList.push(newSong);
        }
        const embed = new EmbedBuilder();
        embed.setColor('#9747FF');
        embed.addFields(songList);
        embed.setTimestamp();
        playlist.saveQueue();
        //interaction.reply({ embeds: [embed] });
        await interaction.reply('The queue has been saved.');
    },
};
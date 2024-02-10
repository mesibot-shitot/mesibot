const {SlashCommandBuilder}= require("@discordjs/builders");
const {MessageEmbed}= require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skip the current song."),
    execute: async ({client, interaction})=>{

        const queue = client.player.getQueue(interaction.guild);
        if(!queue){
            await interaction.reply("there is no song playlist.");
            return;
        }
        const currentSong= queue.current;
        queue.skip();
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`skipped **${currentSong.title}**`)
                    .setThunbnail(currentSong.thumbnail)
            ]
        })
    }    

}
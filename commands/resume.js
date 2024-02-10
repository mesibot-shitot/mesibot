const {SlashCommandBuilder}= require("@discordjs/builders");
const {MessageEmbed}= require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resumes the current song."),
    execute: async ({client, interaction})=>{

        const queue = client.player.getQueue(interaction.guild);
        if(!queue){
            await interaction.reply("there is no song playlist.");
            return;
        }
        queue.setPaused(false);
        await interaction.reply(" the song paused");
    }    

}
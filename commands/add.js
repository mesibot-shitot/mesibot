const {SlashCommandBuilder}= require("@discordjs/builders");
const {MessageEmbed}= require("discord.js");
const {GetListByKeyword} = require("youtube-search-api");
const {joinVoiceChannel, createAudioResource, createAudioPlayer} = require("@discordjs/voice");
const ytdl = require("ytdl-core");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("play a song.")
    .addSubcommand(subcommand=>{
        return subcommand
            .setName("zibi")
            .setDescription("searches for a song.")
            .addStringOption(option=>{
                return option
                    .setName("searchterms")
                    .setDescription("search keywords")
                    .setRequired(true);
        })
    }),
    execute: async ({ interaction})=>{

   // const args = interaction.content.split(" ").slice(2); // get song name from message
        const args = interaction.options.getString("searchterms");
    if (!args.length) return interaction.reply("Please provide a song name.");

    const songInfo = await GetListByKeyword(args, false);
    if (!songInfo || songInfo.items.length === 0) return interaction.reply("Song not found.");

    const songUrl = `https://www.youtube.com/watch?v=${songInfo.items[0].id}`;

        const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply("You need to be in a voice channel.");

    const connection = joinVoiceChannel({
        channelId: interaction.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const stream = ytdl(songUrl, { quality: 'highestaudio', format: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    await interaction.reply(`Now playing: **${songInfo.items[0].title}**`);
}
    }
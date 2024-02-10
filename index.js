const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { GetListByKeyword } = require("youtube-search-api");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

const token = "MTE5NjIyNDY0NTExNzAwNTkxNQ.G91fci.aXaqoQG7cQUf_H5lcUJiwBFvJ4L-dRgL0h4e5Y"; // todo make .env

client.once("ready", () => {
    console.log("Bot is online!");
});

client.on("messageCreate", async (message) => {
    console.log({ message });
    if (message.author.bot || !message.guildId) return;
    if (!message.content.startsWith("mesi play")) return; //todo insert commands router here

    const args = message.content.split(" ").slice(2); // get song name from message
    if (!args.length) return message.reply("Please provide a song name.");

    const songInfo = await GetListByKeyword(args.join(" "), false);
    if (!songInfo || songInfo.items.length === 0) return message.reply("Song not found.");

    const songUrl = `https://www.youtube.com/watch?v=${songInfo.items[0].id}`;

        const channel = message.member.voice.channel;
    if (!channel) return message.reply("You need to be in a voice channel.");

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guildId,
        adapterCreator: message.guild.voiceAdapterCreator
    });

    const stream = ytdl(songUrl, { quality: 'highestaudio', format: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    await message.reply(`Now playing: **${songInfo.items[0].title}**`);
});

client.login(token);
require('dotenv').config();
const { Client, GatewayIntentBits,Collection} = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const path = require('path');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.MESIBOT_TOKEN;

client.once("ready", () => {
    console.log("Bot is online!");
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } catch (error) {
        console.error(`Error loading command file ${file}:`, error);
    }
}



client.on('ready', () => {
    const guildIds = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: '10' }).setToken(token);
    for (const guildId of guildIds) {
        rest.put(Routes.applicationGuildCommands(process.env.MESIBOT_ID, guildId), {
            body: commands
        })
            .then(() => console.log(`Added commands to ${guildId}`))
            .catch(console.error);
    }
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    const channel = interaction.member.voice.channel;
            if (!channel) {
                return interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
            }
    const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
    try {
        await command.execute({ client, interaction });
    } catch (err) {
        console.error(err);
        await interaction.reply('An error occurred while executing that command.');
    }
});



client.login(token);
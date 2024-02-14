require('dotenv').config();
const {
  Client, GatewayIntentBits, Collection, REST,
} = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { GetListByKeyword } = require('youtube-search-api');
const { Routes } = require('discord-api-types/v9');
const CommandController = require('./CommandController');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const controller = new CommandController(client);
const token = process.env.MESIBOT_TOKEN;

client.once('ready', () => {
  console.log('Bot is online!');
  const guildIds = client.guilds.cache.map((guild) => guild.id);
  const rest = new REST({ version: '10' }).setToken(token);
  for (const guildId of guildIds) {
    rest.put(Routes.applicationGuildCommands(process.env.MESIBOT_ID, guildId), {
      body: controller.commands,
    })
      .then(() => console.log(`Added commands to ${guildId}`))
      .catch(console.error);
  }
});
client.on('interactionCreate', async (interaction) => {
  console.log(interaction, interaction.commandName);
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const { channel } = interaction.member.voice;
  if (!channel) {
    return interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  try {
    await command.execute({ interaction, connection });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);

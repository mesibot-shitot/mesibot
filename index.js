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
const controller = new CommandController();
const token = process.env.MESIBOT_TOKEN;
client.commands = new Collection();
client.once('ready', () => {
  controller.reloadCommands();
});
// (async () => {
//   try {
//     console.log('Started refreshing application (/) commands.');
//
//     await rest.put(
//       Routes.applicationCommands(clientId),
//       { body: controller.commands },
//     );
//
//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }
// })();

// client.once('ready', () => {
//   const guildIds = client.guilds.cache.map((guild) => guild.id);
//   const rest = new REST({ version: '10' }).setToken(token);
//   guildIds.forEach((guildId) => {
//     // this is the endpoint for adding commands to a guild
//     rest.put(Routes.applicationGuildCommands(process.env.MESIBOT_ID, guildId), {
//       body: controller.commands,
//     })
//       .then(() => console.log(`Added commands to ${guildId}`))
//       .catch(console.error);
//   });
//   console.log('Bot is online!');
// });
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { channel } = interaction.member.voice;
  if (!channel) {
    interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
    return;
  }
  if (!controller.connection) {
    controller.createConnection(interaction);
  }
  try {
    await controller.doCommand(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);

require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const DbConnection = require('./DB/DbConnection');
const playlistHandler = require('./DB/playlistHandler');

const app = express();

const port = process.env.PORT || 3000;
app.get('/', (req, res) => { res.status(200); });
app.listen(port, () => console.log(`Listening on port ${port}`));
const CommandController = require('./CommandController');
const ConnectionManager = require('./connections/ConnectionManager');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});
const dbConnection = new DbConnection();// todo check later for error handling in connection manager
const controller = new CommandController();
const connectionManager = new ConnectionManager(); // todo manager
const token = process.env.MESIBOT_TOKEN;
client.commands = new Collection();
client.once('ready', async () => {
  await controller.reloadCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { channel } = interaction.member.voice;
  if (!channel) {
    interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
    return;
  }
  if (!connectionManager.findConnection(interaction.guildId) && interaction.commandName !== 'mesi') {
    interaction.reply({ content: 'You need to connect the bot to a voice channel first.\n**Call mesi over with /mesi**', ephemeral: true });
    return;
  }
  try {
    await controller.doCommand(interaction, connectionManager);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
client.login(token);

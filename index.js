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
const { slashInteraction } = require('./handlers/ineractionHandler');

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
client.on('interactionCreate', (interaction) => slashInteraction(interaction, connectionManager, controller));
client.login(token);

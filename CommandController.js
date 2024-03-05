require('dotenv').config();
const { Routes } = require('discord-api-types/v9');
const { REST } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const Playlist = require('./Playlist');

class CommandController {
  constructor() {
    this.commandCollection = new Map();
  }

  async reloadCommands() {
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.js'));

    commandFiles.forEach((file) => {
      const command = require(`./commands/${file}`);
      this.commandCollection.set(command.data.name, command);
      commands.push(command.data.toJSON());
    });
    console.log('Loading commands...');
    const rest = new REST({ version: '10' }).setToken(process.env.MESIBOT_TOKEN);
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(
        Routes.applicationCommands(process.env.MESIBOT_ID),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }

  async doCommand(interaction, connectionManager) {
    const command = this.commandCollection.get(interaction.commandName);
    if (!command) {
      await interaction.reply({ content: 'This command does not exist!', ephemeral: true });
      return;
    }
    try {
      await command.execute({ interaction, connectionManager });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}
module.exports = CommandController;

const { Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

class CommandController {
  constructor(client) {
    this.commands = []; // this is for the rest.put method that adds commands to the guilds
    client.commands = new Collection();
    const foldersPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const commandsPath = path.join(foldersPath, file);
      const command = require(commandsPath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        this.commands.push(command.data.toJSON());
      } else {
        console.log(`[WARNING] The command at ${commandsPath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

module.exports = CommandController;

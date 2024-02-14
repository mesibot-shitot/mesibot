require('dotenv').config();
const { Routes } = require('discord-api-types/v9');
const { REST } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');

class CommandController {
  constructor() {
    this.commandCollection = new Map();
    // this is for the rest.put method that adds commands to the guilds
    // client.commands = new Collection();

    //
    // commandFiles.forEach((file) => {
    //   const commandsPath = path.join(foldersPath, file);
    //   const command = require(commandsPath);
    //   if ('data' in command && 'execute' in command) {
    //     client.commands.set(command.data.name, command);
    //     this.commands.push(command.data.toJSON());
    //   } else {
    //     console.log(`[WARNING] The command at ${commandsPath} is missing a required "data" or "execute" property.`);
    //   }
    // });
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

  createConnection(interaction) {
    const { channel } = interaction.member.voice;
    if (!channel) {
      interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
      return;
    }
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    this.player = createAudioPlayer();
    this.connection.subscribe(this.player);
    console.log('Bot is online!');
  }

  isCommandExists(interaction) {
    return this.commandCollection.get(interaction.commandName);
  }

  async doCommand(interaction) {
    const command = this.isCommandExists(interaction);
    if (!command) {
      await interaction.reply({ content: 'This command does not exist!', ephemeral: true });
      return;
    }
    try {
      await command.execute({ interaction, player: this.player });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}
module.exports = CommandController;

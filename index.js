const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
/**************
 *  Eventos   *
 **************/
const eventsPath = path.join(__dirname, "eventos");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/**************
 *  Comandos   *
 **************/

client.commands = new Collection();
const commandsPath = path.join(__dirname, "comandos");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

try {
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
} catch (error) {
  console.error(`Error loading commands: ${error}`);
}

/*******************
 *  TextCommands   *
*******************/

const textCommandsPath = path.join(__dirname, 'text-commands');
const textCommandFiles = fs.readdirSync(textCommandsPath).filter(file => file.endsWith('.js'));

for (const file of textCommandFiles) {
  const filePath = path.join(textCommandsPath, file);
  const command = require(filePath);
  if ('name' in command && 'execute' in command) {
    client.commands.set(command.name, command);
    console.log(`[INFO] Comando de texto registrado: ${config.bot.prefix}${command.name}`);
  } else {
    console.log(`[WARN] Al comando de texto ubicado en ${filePath} le falta una propiedad requerida "name" o "execute". Sin una de ellas, el comando no se podrá ejecutar`);
  }
}

/**************
 *    Login    *
 **************/
client.login(process.env.DISCORD);

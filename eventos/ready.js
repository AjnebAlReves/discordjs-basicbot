const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const { version } = require("../package.json")

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.user.setPresence({
      activities: [{ name: `MbejuBot - v${version}` }],
      status: "idle",
    });
    const commands = [];
    const commandFiles = fs
      .readdirSync("./comandos")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../comandos/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD);

    (async () => {
      try {
        console.log(`Recargando ${commands.length} comandos (/)...`);
        const data = await rest.put(
          //Routes.applicationGuildCommands(process.env.BOTID, process.env.GuildID), // Put to a guild
          Routes.applicationCommands(client.user.id), // Put to the bot
          { body: commands }
        );

        console.log(`Se cargaron exitosamente ${data.length} comandos (/) :)`);
      } catch (error) {
        console.error(error);
      }
    })();
    console.log(`Conectado como ${client.user.tag}`);
    console.log(`Servidores: ${client.guilds.cache.size}`);
    console.log(`Usuarios: ${client.users.cache.size}`);
    console.log(`Invitación: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`);
  },
};
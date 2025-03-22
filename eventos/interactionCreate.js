module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`[Error] No hay comando existente con el nombre de ${interaction.commandName}.`);
			interaction.reply(`¡Ese comando no existe! (o sí?)`);
			//return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			interaction.reply({content: `Hubo un error ejecutando el comando!`, ephemeral: true});
		}
	},
};

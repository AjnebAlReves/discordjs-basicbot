const fs = require('fs');
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`[Interaction] ${interaction.user.tag} in #${interaction.channel.name} triggered an ${interaction.type} interaction.`);
		switch (interaction.type) {
			case 1:
				console.log('Ping recibido');
				break;
			case 2:
				//console.log('Slash Command');
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
					interaction.reply({ content: `Hubo un error ejecutando el comando!`, ephemeral: true });
				}
				break;
			case 3:
				//console.log('MessageComponent interaction');
				const customId = interaction.customId;
				const componentsPath = `${__dirname}/../components/${customId}.js`;
				if (fs.existsSync(componentsPath)) {
					const component = require(componentsPath);
					component.execute(interaction);
				} else {
					console.error(`No se encontró un componente personalizado con el ID ${customId}.`);
				}
				break;
			case 4:
				console.log('ApplicationCommandAutocomplete interaction');
				break;
			case 5:
				console.log('ModalSubmit interaction');
				break;
			default:
				console.log('Interaction type default');
				break;
		}
	}
};

const fs = require('fs');
const path = require('path');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`[Interaction] ${interaction.user.tag} en #${interaction.channel?.name || 'DM'} activó una interacción de tipo ${interaction.type}.`);

		switch (interaction.type) {
			case 1: // Ping
				console.log('Ping recibido');
				break;

			case 2: // Slash Command
				const command = interaction.client.commands.get(interaction.commandName);

				if (!command) {
					console.error(`[Error] No existe un comando con el nombre "${interaction.commandName}".`);
					return interaction.reply({ content: `¡Ese comando no existe!`, ephemeral: true });
				}

				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(`Error ejecutando ${interaction.commandName}:`, error);
					await interaction.reply({ content: `Hubo un error ejecutando el comando!`, ephemeral: true }).catch(() => { });
				}
				break;

			case 3: // MessageComponent
				const customId = interaction.customId;
				const basePath = customId.startsWith('t_')
					? path.join(__dirname, '../components/tickets')
					: path.join(__dirname, '../components');
				const cId = customId.replace('t_', '');
				const componentPath = path.join(basePath, `${cId}.js`);
				console.log(`Intentando cargar componente desde ${componentPath}`);

				if (fs.existsSync(componentPath)) {
					try {
						console.log(`Ejecutando componente con ID "${customId}" desde ${componentPath}`);
						const component = require(componentPath);
						await component.execute(interaction);
					} catch (error) {
						console.error(`Error ejecutando el componente ${customId}:`, error);
						await interaction.reply({ content: 'Error al procesar la interacción.', ephemeral: true }).catch(() => { });
					}
				} else {
					console.error(`No se encontró el componente con ID "${customId}".`);
					await interaction.reply({ content: 'No se encontró el componente solicitado.', ephemeral: true }).catch(() => { });
				}
				break;

			case 4: // Autocomplete
				const autocompleteCommand = interaction.client.commands.get(interaction.commandName);
				
				if (!autocompleteCommand) {
					console.error(`[Error] No existe un comando con autocompletado para "${interaction.commandName}".`);
					return;
				}

				try {
					await autocompleteCommand.autocomplete(interaction);
				} catch (error) {
					console.error(`Error en autocompletado para ${interaction.commandName}:`, error);
				}
				break;

			case 5: // ModalSubmit
				const modalId = interaction.customId;
				console.log(`Intentando cargar modal con ID "${modalId}" desde ${__dirname}/../modals`);
				const modalPath = path.join(__dirname, '../modals', `${modalId}.js`);

				if (fs.existsSync(modalPath)) {
					try {
						console.log(`Ejecutando modal con ID "${modalId}" desde ${modalPath}`);
						const modal = require(modalPath);
						await modal.execute(interaction);
					} catch (error) {
						console.error(`Error procesando el modal ${modalId}:`, error);
						await interaction.reply({ content: 'Error al procesar el formulario.', ephemeral: true }).catch(() => { });
					}
				} else {
					console.error(`No se encontró el modal con ID "${modalId}".`);
					await interaction.reply({ content: 'No se encontró el procesador del formulario.', ephemeral: true }).catch(() => { });
				}
				break;

			default:
				console.log('Interaction type no reconocido.');
				break;
		}
	}
};
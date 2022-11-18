const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Muestro el perfil de una persona.')
		.addUserOption(option => option.setName('objetivo').setDescription('Usuario al que mostrar su imágen de perfil')),
	async execute(interaction) {
		const user = interaction.options.getUser('objetivo');
		if (user) return interaction.reply(`Avatar de: ${user.username}\n[[Imagen completa]](${user.displayAvatarURL({ dynamic: true })})`);
		return interaction.reply(`Avatar de: ${interaction.user.username}\n[[Imagen Completa]](${interaction.user.displayAvatarURL({ dynamic: true })})`);
	},
};

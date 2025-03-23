const config = require('../config');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: {
        name: 'test_button'
    },
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const categoryId = config.channels.ticketCat;
            const embed = new EmbedBuilder()
                .setDescription(`¿Estás seguro que deseas eliminar este ticket?`)
                .setFooter({ text: 'ByAlReves Studio - Tickets | Solicitado por: ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setColor('#0099ff');

            const confirmRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_delete')
                        .setLabel('Confirmar')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('cancel_delete')
                        .setLabel('Cancelar')
                        .setStyle('Secondary'),
                );

            await interaction.reply({
                embeds: [embed],
                components: [confirmRow],
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hubo un error al procesar tu solicitud!', ephemeral: true });
        }
    }
};

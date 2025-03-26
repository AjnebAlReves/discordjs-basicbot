const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = {
    data: {
        name: 'confirm_pedido'
    },
    async execute(interaction) {
        try {
            const timeToDelete = Math.floor(Date.now() / 1000) + 5;
            await interaction.reply({ content: `Pedido cancelado.`, components: [], ephemeral: true })
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '¡Hubo un error al procesar tu pedido!',
                ephemeral: true
            });
        }
    }
}
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
      const modal = new ModalBuilder()
        .setCustomId('pedido_modal')
        .setTitle('Detalles del Pedido');

      const productoInput = new TextInputBuilder()
        .setCustomId('producto')
        .setLabel('Producto o servicio')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const cantidadInput = new TextInputBuilder()
        .setCustomId('cantidad')
        .setLabel('Cantidad')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const especificacionesInput = new TextInputBuilder()
        .setCustomId('especificaciones')
        .setLabel('Especificaciones especiales')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      const firstActionRow = new ActionRowBuilder().addComponents(productoInput);
      const secondActionRow = new ActionRowBuilder().addComponents(cantidadInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(especificacionesInput);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

      await interaction.showModal(modal);

    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        content: '¡Hubo un error al procesar tu pedido!',
        ephemeral: true 
      });
    }
  }
};
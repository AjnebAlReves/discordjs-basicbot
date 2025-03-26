const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = {
  data: {
    name: 'pedido_modal'
  },
  async execute(interaction) {
    try {
      const producto = interaction.fields.getTextInputValue('producto');
      const cantidad = interaction.fields.getTextInputValue('cantidad');
      const especificaciones = interaction.fields.getTextInputValue('especificaciones');

      const ordersDir = path.join(__dirname, '../data/orders');
      if (!fs.existsSync(ordersDir)) {
        fs.mkdirSync(ordersDir, { recursive: true });
      }

      const orderData = {
        userId: interaction.user.id,
        username: interaction.user.username,
        channelId: interaction.channel.id,
        timestamp: new Date().toISOString(),
        status: 'pending',
        producto: producto,
        cantidad: cantidad,
        especificaciones: especificaciones
      };

      const orderFile = path.join(ordersDir, `${interaction.user.id}_${Date.now()}.json`);
      fs.writeFileSync(orderFile, JSON.stringify(orderData, null, 2));

      const guild = interaction.guild;
      const categoryId = config.channels.ticketCat;

      const channel = await guild.channels.create({
        name: `📝・${interaction.user.username}`,
        type: 0,
        parent: categoryId,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'ReadMessageHistory']
          },
          {
            id: guild.roles.everyone.id,
            deny: ['ViewChannel']
          },
          {
            id: config.roles.staff,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: interaction.client.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle('Solicitud de Pedido')
        .setDescription(`¡Recibimos tu solicitud, ${interaction.user.username}! 📦 Tu pedido ha sido registrado en nuestro sistema.\nNos enfocaremos en procesarlo con la mayor brevedad posible.\nTe mantendremos informado sobre su estado.\n\n**Producto:** ${producto}\n**Cantidad:** ${cantidad}\n**Especificaciones:** ${especificaciones}`)
        .setColor('#0099ff')
        .setTimestamp();

      const deleteBtn = new ButtonBuilder()
        .setCustomId('t_delete_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🗑️')
        .setStyle('Danger');

      const BtnRow = new ActionRowBuilder()
        .addComponents(deleteBtn);

      await interaction.reply({
        content: `Se ha creado tu ticket de pedido en <#${channel.id}>`,
        ephemeral: true
      });

      await channel.send({ 
        content: `<@${interaction.user.id}> | <@&${config.roles.staff}>`,
        embeds: [embed],
        components: [BtnRow]
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        content: '¡Hubo un error al procesar tu pedido!',
        ephemeral: true 
      });
    }  }
};

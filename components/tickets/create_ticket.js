const config = require('../../config');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'test_button'
  },
  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const categoryId = config.channels.ticketCat;

      // Definición de tipos de tickets con sus respectivos emojis, tipos y mensajes personalizados
      const ticketTypes = {
        soporte: {
          emoji: '🎫',
          type: 'Soporte Técnico',
          message: '¡Hola $USER! 🤝 Has abierto un ticket de soporte técnico.\n> Nuestro equipo estará revisando tu solicitud y se pondrá en contacto contigo en breve.\nPor favor, proporciona la mayor cantidad de detalles posible para ayudarnos a resolver tu problema de manera eficiente.'
        },
        bug: {
          emoji: '🐛',
          type: 'Reporte de Error',
          message: 'Gracias por tu colaboración, $USER. 🔍 Tu reporte de error ha sido recibido y registrado.\nPor favor proporciona detalles para que nuestro equipo de desarrollo investigue el problema detalladamente.\nAgradecemos tu ayuda para mejorar nuestra plataforma.'
        },
        pedido: {
          emoji: '📝',
          type: 'Solicitud de Pedido',
          message: '¡Recibimos tu solicitud, $USER! 📦 Tu pedido ha sido registrado en nuestro sistema.\nNos enfocaremos en procesarlo con la mayor brevedad posible.\nTe mantendremos informado sobre su estado.'
        },
        postulacion: {
          emoji: '💼',
          type: 'Postulación',
          message: 'Estimado/a $USER, 🌟 hemos recibido tu postulación con gran interés.\nNuestro equipo de recursos humanos la revisará cuidadosamente.\nAgradecemos tu interés en formar parte de nuestra comunidad.'
        },
      };

      // Selecciona el tipo de ticket basado en la interacción del usuario o usa un tipo por defecto si no coincide
      let selectedType;
      if (interaction.values[0] === 'limpiar') {
        interaction.values = [];
        selectedType = {
          emoji: '❓', type: 'Otro', message: 'Has creado un ticket de tipo desconocido. Por favor, proporciona más detalles.'
        };
      } else {
        selectedType = ticketTypes[interaction.values[0]] || {
          emoji: '❓', type: 'Otro', message: 'Has creado un ticket de tipo desconocido. Por favor, proporciona más detalles.'
        };
      }

      // Extrae los valores necesarios del tipo de ticket seleccionado
      const ticketEmoji = selectedType.emoji;
      const ticketType = selectedType.type;
      const ticketMessage = selectedType.message;

      // Verifica si el usuario ya tiene un ticket abierto en la categoría especificada
      const existingTicket = guild.channels.cache.find(
        channel => channel.name.includes(`・${interaction.user.username}`) &&
          channel.parentId === categoryId
      );

      // Si ya existe un ticket, notifica al usuario y termina la ejecución
      if (existingTicket) {
        return await interaction.reply({
          content: `Ya tienes un ticket abierto en <#${existingTicket.id}>. Si necesitas abrir otro, cierra el anterior primero.`,
          ephemeral: true
        });
      }

      // Manejo especial para tickets de tipo 'pedido'
      if (interaction.values[0] === 'pedido') {
        const modal = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirm_pedido')
              .setLabel('Abrir Modal')
              .setEmoji('💸')
              .setStyle('Primary'),
          );

        // Muestra un formulario específico para pedidos
        return await interaction.reply({
          content: 'Por favor, proporciona los siguientes detalles de tu pedido:\n\n' +
            '1. ¿Qué producto o servicio deseas solicitar?\n' +
            '2. ¿Cantidad deseada?\n' +
            '3. ¿Alguna especificación especial?\n\n' +
            'Una vez proporcionada la información, haz clic en "Confirmar Pedido"',
          components: [modal],
          ephemeral: true
        });
      }

      // Crea un nuevo canal para el ticket con los permisos correspondientes
      const channel = await guild.channels.create({
        name: `${ticketEmoji}・${interaction.user.username}`,
        type: 0, // Canal de texto
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

      // Notifica al usuario sobre la creación exitosa del ticket
      await interaction.reply({ content: `Se ha creado tu ticket de ${ticketType} en <#${channel.id}>`, ephemeral: true });
      const newTicketMessage = ticketMessage.replace('$USER', interaction.user.username);

      // Crea y configura el embed con la información del ticket
      const embed = new EmbedBuilder()
        .setTitle(`Ticket de ${ticketType}`)
        .setDescription(newTicketMessage)
        .setColor('#0099ff');

      // Crea el botón para cerrar el ticket
      const deleteBtn = new ButtonBuilder()
        .setCustomId('t_delete_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🗑️')
        .setStyle('Danger');

      const BtnRow = new ActionRowBuilder()
        .addComponents(deleteBtn);

      // Envía el mensaje inicial en el canal del ticket con las menciones correspondientes
      await channel.send({ content: `<@${interaction.user.id}> | <@&${config.roles.staff}>`, embeds: [embed], components: [BtnRow] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error creating the channel!', ephemeral: true });
    }
  }
};
const config = require('../config');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
  data: {
    name: 'test_button'
  },
  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const categoryId = config.channels.ticketCat;

      // Check if user already has a ticket
      const existingTicket = guild.channels.cache.find(
        channel => channel.name === `🎫・${interaction.user.username}` && 
        channel.parentId === categoryId
      );

      if (existingTicket) {
        return await interaction.reply({ 
          content: `You already have a ticket open at <#${existingTicket.id}>!`, 
          ephemeral: true 
        });
      }

      const channel = await guild.channels.create({
        name: `🎫・${interaction.user.username}`,
        type: 0, // Text channel
        parent: categoryId,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
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

      await interaction.reply({ content: `Channel <#${channel.id}> has been created!`, ephemeral: true });

      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.user.username}** has created a ticket. Please wait for a staff member to assist you.`)
        .setColor('#0099ff');
      const deleteBtn = new ButtonBuilder()
        .setCustomId('delete_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🗑️')
        .setStyle('Danger');

      const BtnRow = new ActionRowBuilder()
        .addComponents(deleteBtn);

      await channel.send({ content: `<@${interaction.user.id}> | <@&${config.roles.staff}>`, embeds: [embed], components: [BtnRow] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error creating the channel!', ephemeral: true });
    }

  }
};
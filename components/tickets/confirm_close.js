const config = require('../../config');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: {
        name: 'test_button'
    },
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const categoryId = config.channels.ticketCat;

            const reopenButton = new ButtonBuilder()
                .setCustomId('t_reopen_ticket')
                .setLabel('Reabrir Ticket')
                .setStyle('Success');

            const deleteButton = new ButtonBuilder()
                .setCustomId('t_delete_ticket')
                .setLabel('Eliminar Ticket')
                .setStyle('Danger');

            const row = new ActionRowBuilder()
                .addComponents(reopenButton, deleteButton);

            const embed = new EmbedBuilder()
                .setDescription(`El ticket fue cerrado por ${interaction.user.toString()}`)
                .setColor('#0099ff')
                .setFooter({ text: 'ByAlReves Studio - Tickets | Solicitado por: ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
            
            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            const channel = interaction.channel;
            
            // Encontrar al dueño del ticket y remover sus permisos
            const ticketOwner = channel.permissionOverwrites.cache.find(overwrite => 
                overwrite.type === 'member' && overwrite.allow.has('ViewChannel')
            );
            
            if (ticketOwner) {
                await channel.permissionOverwrites.delete(ticketOwner.id);
            }

            // Guardamos los mensajes enviados en el TXT
            const messages = await channel.messages.fetch({ filter: (message) => !message.author.bot });
            const messageContent = Array.from(messages.values())
                .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
                .map(message => ({
                    user: message.author.username,
                    createdAt: message.createdTimestamp,
                    content: message.content || "Mensaje vacio",
                    embeds: message.embeds
                }));
            fs.writeFileSync(`${channel.id}-${Math.floor(new Date() / 1000)}.json`, JSON.stringify(messageContent, null, 2));
            
            // Ya no eliminamos el canal automáticamente, esperamos la interacción con los botones
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hubo un error al procesar tu solicitud!', ephemeral: true });
        }
    }
};
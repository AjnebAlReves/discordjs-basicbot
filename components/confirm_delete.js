const config = require('../config');
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
            const embed = new EmbedBuilder()
                .setDescription(`Cerrando y Eliminando ticket...`)
                .setColor('#0099ff')
                .setFooter({ text: 'ByAlReves Studio - Tickets | Solicitado por: ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({
                embeds: [embed]
            });

            // Guardamos los mensajes enviados en el TXT
                    const channel = interaction.channel;
                    const messages = await channel.messages.fetch({ filter: (message) => !message.author.bot });
                    const messageContent = Array.from(messages.values())
                        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
                        .map(message => `${message.author.username}: ${message.content || "Mensaje vacio"}`)
                        .join('\n');
                    fs.writeFileSync(`${channel.id}-${Math.floor(new Date() / 1000)}.txt`, messageContent);            // Eliminamos el canal
            await channel.delete();
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hubo un error al procesar tu solicitud!', ephemeral: true });
        }
    }
};